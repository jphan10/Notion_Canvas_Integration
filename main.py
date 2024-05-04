import requests
import os
from dotenv import load_dotenv
from datetime import datetime
import requests
import canvasapi


load_dotenv(r"D:\GONZAGA\Fall 2023\Personal Projects\Notion Canvas\.env")

api_token = os.getenv("CANVAS_API_TOKEN")
notion_token = os.getenv("NOTION_KEY")
notion_database_key = os.getenv("NOTION_DATABASE_ID")


headers = {
    'Authorization': f'Bearer {api_token}'
}

notion_headers = {
    'Authorization': f'Bearer {notion_token}',
    'Content-Type': 'application/json',
}


# Define the API endpoint


def get_course_id():
    course_list = []
    api_url = f'https://canvas.gonzaga.edu/api/v1/courses'
    response = requests.get(api_url, headers=headers)
    response.raise_for_status()

    courses = response.json()

    for course in courses:
        course_list.append((course['name'], course['id']))
    return course_list


def get_assignments(course_id):
    assignment_list = []
    api_url = f'https://canvas.gonzaga.edu/api/v1/courses/{
        course_id}/assignments'
    response = requests.get(api_url, headers=headers)
    response.raise_for_status()

    assignments = response.json()

    for assignment in assignments:
        assignment_name = assignment['name']
        due_date = assignment['due_at']
        points_possible = assignment['points_possible']
        assignment_list.append((assignment_name, due_date, points_possible))

    return assignment_list


def get_one_assignment(course_id):
    assignments = get_assignments(course_id)
    return assignments[0]


def create_notion_page(assignment):
    notion_endpoint = f'databases/{notion_database_key}/pages'
    notion_url = f'https://api.notion.com/v1/{notion_endpoint}'

    properties = {
        "Name": {
            "title": [
                {
                    "text": {
                        "content": assignment[0],  # Fix the missing comma here
                    },
                },
            ],
        },
    }

    data = {
        "parent": {"database_id": notion_database_key},
        "properties": properties,
    }

    try:
        response = requests.post(notion_url, headers=notion_headers, json=data)
        response.raise_for_status()
        print(f"Notion page created for {assignment[0]}")
    except requests.exceptions.RequestException as e:
        print(f"Error creating Notion page: {e}")


def main():

    # result = get_course_id()
    # result = get_assignments(11277)
    # for assignments in result:
    #    print(assignments)

    result = get_one_assignment(11277)
    print(result)
    # create_notion_page(result)


main()
