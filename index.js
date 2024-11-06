// Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js"
import { getDatabase,
         ref,
         push,
         onValue,
         remove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Setup firebase database
const firebaseConfig = {
    databaseURL: "https://aron-leads-tracker-default-rtdb.firebaseio.com"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

// Create reference in database called leads
const referenceInDB = ref(database, "leads")

// Get HTML elements
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")

// Function to display the leads on website
function render(leads) {
    let listItems = ""
    
    // Use template string to store a lead each as a list item with a hyperlink that opens up a new tab
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `
    }

    // Display leads in bullet form format
    ulEl.innerHTML = listItems
}

onValue(referenceInDB, function(snapshot) {

    // Only update the leads on website when snapshot does exist(snapshot doesn't exist when user deletes all leads)
    if (snapshot.exists()) {
        // Get values of snapshot
        const snapshotValues = snapshot.val()

        // Convert the snapshot values into an array of values(i.e. links)
        const leads = Object.values(snapshotValues)
        render(leads)
    }
})

deleteBtn.addEventListener("dblclick", function() {
    // Remove leads from database
    remove(referenceInDB)

    // Clear leads from home screen
    ulEl.innerHTML = ""
})

inputBtn.addEventListener("click", function() {
    // Push leads value to Firebase database
    push(referenceInDB, inputEl.value)

    // Clear input value so user can enter new input
    inputEl.value = ""
})