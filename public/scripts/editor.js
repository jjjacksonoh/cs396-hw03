const baseURL = '';


const initResetButton = () => {
    // if you want to reset your DB data, click this button:
    document.querySelector('#reset').onclick = ev => {
        fetch(`${baseURL}/reset/`)
            .then(response => response.json())
            .then(data => {
                console.log('reset:', data);
            });
    };
};


let currentDoctor;
let doctors;

const displayDoctor = (doctor) => {
    currentDoctor = doctor;
    document.getElementById('doctor').innerHTML = `
    <div>
        <h1 id=${doctor._id}>${doctor.name}</h1>
        <img src="${doctor.image_url}"></img>
        <p> Seasons: ${doctor.seasons}</p>
        <button id="edit" onclick="editDocButton()">Edit Doctor</button>
        <button id="delete" onclick="deleteDoc()">Delete Doctor</button>
    </div>`

    //document.getElementById('edit').onclick
}

const attachEventHandlers = () => {
    document.querySelectorAll('#all_doctors a').forEach(a => {
        a.onclick = showDetail;
    });
}

const showDetail = ev => {
    const id = ev.currentTarget.dataset.id;
    const doctor = doctors.filter(doc => doc._id === id)[0];
    fetch(`${baseURL}/doctors/${doctor._id}/companions`)
    .then(response => response.json())
    .then(companions => {
        const compList = companions.map(data => `
        <div>
            <img src="${data.image_url}">
            <p>${data.name}</p>
        </div>`
        );
        document.getElementById('companions').innerHTML = `
        <u1>
            ${compList.join('')}
        </u1>`
    })
    displayDoctor(doctor);
}

const initDoctors = () => {
    fetch(`${baseURL}/doctors/`)
        .then(response => response.json())
        .then(data => {
            doctors = data;
            const listItems = data.map(item => `
            <li>
                <a href="#" data-id="${item._id}">${item.name}</a>
            </li>`
            );
            document.getElementById('all_doctors').innerHTML = `
                <ul>
                    ${listItems.join('')}
                </ul>`
        })
        .then(attachEventHandlers)
}

const createDoc = () => {
    document.getElementById('doctor').innerHTML = `
    <form>
        <!-- Name -->
        <label for="name">Name</label>
        <input type="text" id="name">
        </br>
        </br>
        <!-- Seasons -->
        <label for="seasons">Seasons</label>
        <input type="text" id="seasons">
        </br>
        </br>
        <!-- Ordering -->
        <label for="ordering">Ordering</label>
        <input type="text" id="ordering">
        </br>
        </br>
        <!-- Image -->
        <label for="image_url">Image</label>
        <input type="text" id="image_url">
        </br>
        </br>
        <!-- Buttons -->
        <button onclick="newDoc()" class="btn btn-main" id="create">Save</button>
        <button onclick="cancelDoc()" class="btn" id="cancel">Cancel</button>
    </form>`
    document.getElementById('companions').innerHTML = `` 
}

const cancelDoc = () => {
    document.getElementById('doctor').innerHTML = ``
}

const goodSeasons = (seasons) => {
    let bool = false;
    var all_seasons = seasons.split(',');
    all_seasons.forEach(season => {
        if(isNaN(season)){
            bool = true;
        }
    })
    return bool;
}

const goodData = () => {
    if(document.getElementById('name').value == "" || !isNaN(document.getElementById('name').value)) {
        document.getElementById('doctor').innerHTML += `
        <div>Error: Please enter a valid name</div>`
        return false
    }

    if(goodSeasons(document.getElementById('seasons').value)){
        document.getElementById('doctor').innerHTML += `
        <div>Error: Please enter valid seasons</div>`
        return false;
    }
    return true;
}

const newDoc = () => {
    const goodForm = goodData();
    if(goodForm) {
        const newDoc = {
            name: document.getElementById('name').value,
            seasons: document.getElementById('seasons').value.split(','),
            ordering: document.getElementById('ordering').value,
            image_url: document.getElementById('image_url').value
        };
        fetch(`${baseURL}/doctors/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newDoc)
        })
        .then(response => response.json())
        .then(doc => {
            displayDoctor(doc);
            initDoctors()
        })
        .catch(err => console.log(err))
    } else {
        return
    }
}

const editDocButton = () => {
    const id = document.querySelector('#doctor h1').id;
    currentDoctor = id;
    const doctor = doctors.filter(doc => doc._id === id)[0];
    fetch(`${baseURL}/doctors/${doctor._id}`)
    .then(response => response.json())
    .then(doctor => {
        document.getElementById('doctor').innerHTML = `
            <form>
                <!-- Name -->
                <label for="name">Name</label>
                <input type="text" id="name" value="${doctor.name}">
                </br>
                </br>
                <!-- Seasons -->
                <label for="seasons">Seasons</label>
                <input type="text" id="seasons" value="${doctor.seasons}">
                </br>
                </br>
                <!-- Ordering -->
                <label for="ordering">Ordering</label>
                <input type="text" id="ordering" value="${doctor.ordering}">
                </br>
                </br>
                <!-- Image -->
                <label for="image_url">Image</label>
                <input type="text" id="image_url" value="${doctor.image_url}">
                </br>
                </br>
                <!-- Buttons -->
                <button onclick="editDoc()" class="btn btn-main" id="create">Save</button>
                <button onclick="cancelDoc()" class="btn" id="cancel">Cancel</button>
            </form>`
            document.getElementById('companions').innerHTML = ``
    })
}

const editDoc = () => {
    const goodForm = goodData();
    if(goodForm) {
        const newDoc = {
            name: document.getElementById('name').value,
            seasons: document.getElementById('seasons').value.split(','),
            ordering: document.getElementById('ordering').value,
            image_url: document.getElementById('image_url').value
        };
        fetch(`${baseURL}/doctors/${currentDoctor}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newDoc)
        })
        .then(response => response.json())
        .then(doc => {
            displayDoctor(doc);
            initDoctors()
        })
        .catch(err => console.log(err))
    } else {
        return
    }
}

const deleteDoc = ev => {
    const id = document.querySelector('#doctor h1').id;
    const doctor = doctors.filter(doc => doc._id === id)[0];
    const del = window.confirm('Confirm deletion');
    if(del){
        fetch(`${baseURL}/doctors/${doctor._id}`, {
            method: 'DELETE'
        })        .then( () => initDoctors())
        .then( () => {
            document.getElementById('doctor').innerHTML = ``;
            document.getElementById('companions').innerHTML = ``;
        })
        .catch(err => {
            console.error(err);
        });
    } else {
        return;
    }
}
// invoke this function when the page loads:
initResetButton();
initDoctors();