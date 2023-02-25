let textArea = document.getElementById("text-area");
let listContainer = document.getElementById("list-ul");
let list = null;

// console.log(listContainer);

window.addEventListener("load",function(){
    requestFromServer(null,"GET",function(request){
        let data = request.responseText;
        if(data === "Error"){
            alert("Error Please Reload");
        }else{
            list = data;
            list = JSON.parse(list);
            list.forEach((element)=>{
                let elementReturn = makeElement(element);
                // console.log(elementReturn);
                listContainer.appendChild(elementReturn);
            })
        }
    })
});

function makeElement(element){
    let listItem = document.createElement("li");
    listItem.classList.add("list-item");
    listItem.setAttribute("id",`${element.id}`);
    let textDiv = document.createElement("div");
    textDiv.classList.add("text");
    textDiv.innerText = element.title;
    listItem.insertAdjacentElement("afterbegin",textDiv);

    let btnDiv = document.createElement("div");
    btnDiv.classList.add("btnDiv");
    let checkBox = document.createElement("input");
    checkBox.setAttribute("type","checkbox");
    if(element.statu == true){
        checkBox.checked = true;
        listItem.style.textDecoration = "line-through";
    }
    checkBox.setAttribute("onclick",`checkBoxPress(${element.id})`);
    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = 'X';
    deleteBtn.setAttribute("onclick",`deleteElement(${element.id})`);
    btnDiv.appendChild(checkBox);
    btnDiv.appendChild(deleteBtn);
    listItem.appendChild(btnDiv);
    return listItem;
}


function checkBoxPress(element){
    // console.log(list);
    
    let id = element.id;
    let index ;
    let status = list.filter(function(element,i){
        if(element.id == id){
            index = i;
            return true;
        }else{
            return false;
        }
    })[0].statu;

    // console.log(typeof status);

    let obj ={
        id : element.id,
        stat : !status
    };
    // console.log(obj);
    requestFromServer(obj,"PUT",function(request){
        // console.log(request.status);
        if(request.status == 200){
            list[index].statu = !status;
            if(list[index].statu){
                element.style.textDecoration = "line-through";
            }else{
                element.style.textDecoration = 'none';
            }
        }
    })
}



function deleteElement(element){
    console.log(element);
    let id = element.id;
    console.log(id);
    // element.remove();
    requestFromServer({id:id},"DELETE",function(request){
        if(request.status == 200){
            list = list.filter((element)=>{
                if(element.id == id){
                    return false;
                }
                return true;
            })
            element.remove();
        }
    })
}


function addElement(){
    let value = textArea.value;
    value = value.trim();
    if(value == ""){
        return ;
    }
    
    requestFromServer({title:"value"},"POST",function(request){
        if(request.status == 200){
            let dataToAppend = JSON.parse(request.responseText);
        }
        let dataToAppend = JSON.parse(request.responseText);
        console.log(dataToAppend);
    })
}



function requestFromServer(data,method, callback){
    console.log(data);
    let url = "http://127.0.0.1:3000/";
    let request = new XMLHttpRequest;
    request.open(method,url+"getData");
    request.setRequestHeader("Content-Type","application/JSON");
    if(data == null){
        request.send();
    }else{
        data = JSON.stringify(data);
        request.send(data);
    }
    request.addEventListener("load",function(){
        callback(request);
        // console.log(request);
    });
}

