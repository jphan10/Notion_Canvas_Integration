import requests
import os
from dotenv import load_dotenv

load_dotenv(r"D:\GONZAGA\Fall 2023\Personal Projects\Notion Canvas\.env")

api_token = os.getenv("CANVAS_API_TOKEN")



headers = {
    'Authorization': f'Bearer {api_token}'
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
    api_url = f'https://canvas.gonzaga.edu/api/v1/courses/{course_id}/assignments'
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

def create_notion_page():
    #delete later just for itterative attempt
    assignment = get_one_assignment(8135)
    


def main():
    pass

main()
