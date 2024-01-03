var data;
var show = document.querySelector('#show');
var courses = {};
var students = [];
var teachers = [];
var selectedCourse;
var logInUser;

fetch('./sche.json')
   .then((response) => response.json())
   .then((sche) => {
      data = sche;
      console.log(sche);
      document.querySelector('h1').innerHTML = sche.university.name + " / " + sche.university.location;

      createPeople(data);
      coursesObject(data);
      //createPage(logInUser);
      document.querySelector('#web-name').innerHTML = sche.university.name;
   });


function courseBar(e) {
  
   let studentTable = '';
   let teachersTable = '';
   let materialsTable = '';

   if (e == 1) {
      for (let i in courses[selectedCourse].studyMaterials) {
         materialsTable += `<tr><td>${i}</td><td>${courses[selectedCourse].studyMaterials[i].title}</td></tr>`;
      }
   
      document.querySelector('#present-table').innerHTML = ` <tr><th>Title</th><th>Authors</th></tr>
      ${materialsTable}
  `;

   }
   if (e == 2) {
      for (let i in courses[selectedCourse].students) {
         studentTable += `<tr><td>${i}</td><td>${courses[selectedCourse].students[i].name}</td></tr>`;
      }

      document.querySelector('#present-table').innerHTML = `    <tr><th>ID</th><th>Name</th></tr>
      ${studentTable}
  `;

   }

   if (e == 3) {
      for (let i in courses[selectedCourse].teachers) {
         teachersTable += `<tr><td>${i}</td><td>${courses[selectedCourse].teachers[i].name}</td></tr>`;
      }
   
      document.querySelector('#present-table').innerHTML = `    <tr><th>ID</th><th>Name</th></tr>
      ${teachersTable}
      `;

   }
}
function coursesObject(d) {

   for (let i in d.university.programs) {
      for (let j in d.university.programs[i].subjects) {

         addProperty(courses, j, d.university.programs[i].subjects[j])

      }
   }
   console.log(courses);

}
function addProperty(obj, key, value) {
   // Check if the property already exists
   if (!(key in obj)) {
      // If it doesn't exist, add the property
      obj[key] = value;
   } else {
   }
}

function logIn() {
   var ID = document.querySelector('#ID').value;
   let exist = false;


   for (let i in students) {
      if (ID == students[i].id) {
         document.querySelector('#form').style.display = "none";
         exist = true;
         logInUser = students[i];
         break;
      }
   }

   for (let i in teachers) {
      if (ID == teachers[i].id) {
         document.querySelector('#form').style.display = "none";
         exist = true;
         logInUser = teachers[i];

         break;
      }
   }

   exist ? createPage(logInUser) : alert("ID is incorrect");

}


function createPage(e) {
   document.querySelector('main').style.display='block';
   document.querySelector('#name').innerHTML = `<span onclick="createCoursesA('` + e.id + `')" >` + e.name + `</span>`;
   document.querySelector('#position').innerHTML = e.position;

   

   createCourses(e);

}

function createCoursesA(e) {
   console.log(students);
   x = findUserById(students, e);
   console.log(x)
   createCourses(x);

}

function createCourses(e) {



   const allCourses = (e) => {
      let result = '';
      for (let i in e.course) {
         var cName = courses[String(e.course[i])];
         result += `
         <div class="single-course" onclick="showCourse('${e.course[i]}')">
            <h2>${cName.name}</h2> 
            <p>code: ${e.course[i]}</p>
         </div>
         `;
      }
      return result;
   }

   show.innerHTML = allCourses(e);



}
function showCourse(e) {

   let result = '';
   selectedCourse = e;

   result = `
<h4 id="course-name">${courses[e].name} <span>${courses[e].credits} credits</span></h4> 
<div id="course-info">
    <div id="bar">
        <div onclick="courseBar(1)">
    Study Materials
    </div>
    <div onclick="courseBar(2)">
        Students
        </div>
        <div onclick="courseBar(3)">
            Teachers
            </div>
        </div>

<table id="present-table" >
</table>

`;


   show.innerHTML = result;

}

function createPeople(d) {

   for (let i in d.university.programs) {
      for (let j in d.university.programs[i].subjects) {

         for (let s in d.university.programs[i].subjects[j].students) {
            let e = d.university.programs[i].subjects[j].students[s]
            students.push({
               id: s,
               position: "Student",
               name: e.name,
               course: [j]
            });
         }

         for (let s in d.university.programs[i].subjects[j].teachers) {
            let e = d.university.programs[i].subjects[j].teachers[s]
            teachers.push({
               id: s,
               position: "Teacher",
               name: e.name,
               course: [j]
            });
         }

      }
   }
   console.log(students);

   students = students.reduce((accumulator, currentObj) => {
      const existingObj = accumulator.find(obj => obj.id === currentObj.id);

      if (existingObj) {
         // Merge course arrays
         existingObj.course = [...existingObj.course, ...currentObj.course];
         existingObj.course = [...new Set(existingObj.course)];

      } else {
         // Add the current object to the accumulator
         accumulator.push(currentObj);
      }

      return accumulator;
   }, []);

   console.log(students);

   teachers = teachers.reduce((accumulator, currentObj) => {
      const existingObj = accumulator.find(obj => obj.id === currentObj.id);

      if (existingObj) {
         // Merge course arrays
         existingObj.course = [...existingObj.course, ...currentObj.course];
         existingObj.course = [...new Set(existingObj.course)];

      } else {
         // Add the current object to the accumulator
         accumulator.push(currentObj);
      }

      return accumulator;
   }, []);

}

function findUserById(array, searchId) {
   return array.find(function (user) {
      return user.id === searchId;
   });
}
