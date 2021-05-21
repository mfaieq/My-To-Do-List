let nameTask, description, assign, date, status, validate;

function retrieveValues(){
  nameTask = document.querySelector("#nameForm").value;
  description = document.querySelector("#Description").value;
  assign = document.querySelector("#assignForm").value;
  date = document.querySelector("#dateForm").value;
  status = document.querySelector("#statusForm").value;
  validate = validateForm(nameTask, description, assign, date, status)
}

document.addEventListener("click", function (event) {
  let button = event.target.nodeName == "BUTTON";
  if (button) {
    let clicked = event.target;
    let id = clicked.attributes.id.value;
    if (id === "delete") {
      taskManager.deleteTask(clicked);
    } else if (id === "update") {
      taskManager.updateTask(clicked);
    }
  }
});

document.querySelector("#submit").addEventListener("click", function () {
  retrieveValues();
  
  if (validate){
    taskManager.createTaskObject(
      nameTask, 
      description, 
      assign, 
      date, 
      status
    )
  };

  document.querySelector("#thisForm").reset();
});

dateForm.min = new Date().toISOString().split("T")[0];


function validateForm(nameTask, description, assign, date, status){
  let validNameTask = false;
  let validDescription = false;
  let validAssign = false;
  let validDate = false;
  let validStatus = false;
  let validate = false;

  if ((nameTask == "") || (nameTask.length>20)) {
    alert("Name must be filled out / should be less than or equal to 20 characters");
  } else {
    validNameTask = true;
  }
  if ((description=="")|| (description.length>20)) {
    alert("Enter valid description");
  } else{
    validDescription = true;
  } 
  if ((assign=="")|| (assign.length>20)) {
      alert("Enter valid imput for 'Assigned To' ");
   } else{
     validAssign = true;
   }
  if (date=="") {
      alert("Enter valid due date");
    } else {
     validDate = true;
    }
  if (status=="") {
      alert("Enter valid Status");  
  } else {
    validStatus = true;
  }
  if (
    validNameTask == true &&
    validDescription == true &&
    validAssign == true &&
    validDate == true &&
    validStatus == true)
    {
      validate = true;
    }
    return validate;
};



class TaskManager {
  constructor(){
    this.taskList = [];
  };
  createTaskObject(nameTask, description, assign, date, status) {

    this.taskList.push({
      Name: nameTask,
      Description: description,
      AssignedTo: assign,
      DueDate: date,
      Status: status,
      TaskID: 
      `${ taskManager.taskList.length + 1}`
    });

    localStorage.setItem("tasks", JSON.stringify(taskManager.taskList));

    let newTask = this.taskList[this.taskList.length - 1];

    this.addTask(newTask);
  }

  addTask(newTask) {
    let taskCards = `  
    <div class="col-md-4" id="${newTask.TaskID}">
      <div class="card">
        <div class="card-header">
            <b>Task</b>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <b>Name:</b>
              <p>${newTask.Name}</p>
          </li>
          <li class="list-group-item">
            <b>Description:</b>
            <p>${newTask.Description}</p>
          </li>
          <li class="list-group-item">
            <b>Assigned to:</b>
            <p>${newTask.AssignedTo}</p>
          </li>
          <li class="list-group-item">
            <b>Due Date:</b>
            <p>${newTask.DueDate}</p>
          </li>
          <li class="list-group-item">
            <b>Status:</b>
            <p>${newTask.Status}</p>
          </li>
        </ul>
          <div class= "btns-container">
            <div class="row">
              <div class="col">
                <button id="delete" type="button" class="btn btn-primary form-control delete">Delete</button>
              </div>
              <div class="col">
                <button id="update" type="button" class="btn btn-primary form-control update">Update</button>
              </div>
            </div>
          </div>
      </div>
    </div> `;

    let listCards = ` <li class="list-group-item oneItem" id="${newTask.TaskID}">${newTask.Name} | ${newTask.DueDate} | ${newTask.Status}</li>`;
  
    let insertCard = document.querySelector('#listSection')
    insertCard.innerHTML += listCards 
    
    let insertList = document.querySelector('#largeCardsSection')
    insertList.innerHTML +=taskCards
  };

  deleteTask(clicked) {
    let parent = clicked.parentNode.parentNode.parentNode.parentNode.parentNode.attributes.id.value;
    for (let i = 0; i < this.taskList.length; i++) {
      if (this.taskList[i].TaskID == parent) {
        this.taskList.splice(i, 1);
        localStorage.setItem("tasks", JSON.stringify(taskManager.taskList));
        clicked.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
          clicked.parentNode.parentNode.parentNode.parentNode.parentNode)
      };
    };

    let listOfTasks = document.querySelectorAll(".oneItem");
    for (let i = 0; i < listOfTasks.length; i++) {
      if (listOfTasks[i].attributes.id.value == parent) {
        listOfTasks[i].remove();
      }
    }
  }


  updateTask(clicked) {
    let task = [];
    let updateTaskId =
      clicked.parentNode.parentNode.parentNode.parentNode.parentNode.attributes.id.value;
    for (let i = 0; i < this.taskList.length; i++) {
      if (this.taskList[i].TaskID == updateTaskId) {
        task = this.taskList[i];
      }
    }

    document.querySelector("#nameForm").value = task.Name;
    document.querySelector("#Description").value = task.Description;
    document.querySelector("#assignForm").value = task.AssignedTo;
    document.querySelector("#dateForm").value = task.DueDate;
    document.querySelector("#statusForm").value = task.Status;
    document.querySelector("#submit").outerHTML = `<button id="save" type="button" class="btn btn-primary form-control">Save</button>`;

    document.querySelector("#save").addEventListener("click", function () {
      retrieveValues();

      if (validate) {
        task.Name = nameTask;
        task.Description = description;
        task.AssignedTo = assign;
        task.DueDate = date;
        task.Status = status;

        localStorage.setItem("tasks", JSON.stringify(taskManager.taskList));
        location.reload();
      }
    });
  }

};

let taskManager = new TaskManager();

let data = localStorage.getItem("tasks");
if (data) {
  taskManager.taskList = JSON.parse(data);
  addPageContent(taskManager.taskList);
}

function addPageContent(array) {
  for (let i = 0; i < array.length; i++) {
    taskManager.addTask(array[i]);
  }
}

