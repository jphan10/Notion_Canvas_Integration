require('dotenv').config();
const axios = require('axios');
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_KEY });

let assignmentArray = [];
const accessToken = process.env.CANVAS_ID;
const canvasApiUrl = `https://canvas.gonzaga.edu`;

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
                    date: dueDate.toISOString().split('T')[0],
                    points_possible: assignment.points_possible,
                };

                assignmentArray.push(formattedAssignment);
            } catch (error) {
                console.error(`Error processing assignment: ${error.message}`);
            }
        });
    } catch (error) {
        console.error('Error fetching assignments:', error.message);
        throw error;
    }
}

const courseID = 10315;
//get_assignments(courseID)
//    .then(() => {
//console.log(assignmentArray);
 //   });

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

async function createNotionPage() {
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
                                "content": "test"
                            }
                        }
                    ]
                },
                "date": {
                    "date": {
                        "start": "2023-02-23"
                    }
                },
            }
        }
        await sleep(300)

        console.log(`Sending to Notion`)
        const response = await notion.pages.create(data)
        console.log(response)
    console.log(`Operation complete.`)
}

createNotionPage()