addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("http://localhost:3000/api/class")
    const courses = await response.json()

    let html = ""

    for (let course of courses) {
        let classID = course._id

        html += `
            <tr>
                <td>${course.Course}</td>
                <td>${course.CreditHours}</td>
                <td>${course.teacher}</td>
                <td>
                    <a href="details.html?id=${classID}">Details</a> |
                    <a href="addStudentClass.html?id=${classID}">Add</a>
                </td>
            </tr>
        `
    }

    document.querySelector("#list_of_class").innerHTML = html
})