require('dotenv').config();
const axios = require('axios');
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_KEY });

let assignmentArray = [];
const accessToken = process.env.CANVAS_ID;
const canvasApiUrl = process.env.URL;

courseIDs = [12901, 11277, 12906, 11112, 11580, 10315];

async function get_course_name(courseId){
    switch(courseId){
        case 12901:
            return "CPSC-260";
        case 11277:
            return "BMIS-235";
        case 12906:
            return "COMM-100";
        case 11112:
            return "CPSC-224";
        case 11580:
            return "CPSC-326";
        case 10315:
            return "MATH-321";
    }
}

async function get_assignments(courseId) {
    try {
        const response = await axios.get(`${canvasApiUrl}/api/v1/courses/${courseId}/assignments`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        assignmentArray = []; // Clear existing assignments in assignmentArray

        response.data.forEach((assignment) => {
            try {
                const dueDate = assignment.due_at instanceof Date ? assignment.due_at : new Date(assignment.due_at);

                const formattedAssignment = {
                    name: assignment.name,
                    date: dueDate.toISOString(),
                    points_possible: assignment.points_possible,
                    course_name: get_course_name(courseId),

                };
                if(formattedAssignment.date > "2024-01-24"){ //change to pull current date
                    assignmentArray.push(formattedAssignment);
                }
            } catch (error) {
                console.error(`Error processing assignment: ${error.message}`);
            }
        });
    } catch (error) {
        console.error('Error fetching assignments:', error.message);
        throw error;
    }
    createNotionPage()
}

const courseID = 10315;

for( let courseID of courseIDs){
    get_assignments(courseID)
}

//get_assignments(courseID)
//    .then(() => {
//console.log(assignmentArray);
 //   });

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

async function createNotionPage() {
    for (let assignment of assignmentArray) {
        const data = {
            "parent": {
                "type": "database_id",
                "database_id": process.env.NOTION_DATABASE_ID
            },
            "properties": {
                "name": {
                    "title": [
                        {
                            "text": {
                                "content": assignment.name
                            }
                        }
                    ]
                },
                "date": {
                    "date": {
                        "start": assignment.date
                    }
                },
            }
        }
        await sleep(100)

        console.log(`Sending to Notion`)
        const response = await notion.pages.create(data)
        console.log(response)
    }
    console.log(`Operation complete.`)
}
