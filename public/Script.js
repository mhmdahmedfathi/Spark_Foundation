function getdiv(e) {
    if (document.getElementById(e.target.id) != null) {

        let hide = document.querySelector(".your-active-class");
        document.getElementById(hide.getAttribute("data-nav")).setAttribute("style", "display:none");
        hide.classList.remove("your-active-class");
        var active = document.getElementById(e.target.id);
        var div = document.getElementById(e.target.getAttribute("data-nav"));
        var x = window.matchMedia("(max-width: 700px)")
        if(!x.matches){
            if (e.target.getAttribute("data-nav") != "About")
            div.setAttribute("style", "display:block");
                else
            div.setAttribute("style", "display:ruby");
        }else{
            div.setAttribute("style", "display:flex");
        }
        active.setAttribute('class', "your-active-class")
    }
}

const postdata =async(url='',data={})=>{

    const response= await fetch(url,{
        method:"POST",
        credentials:"same-origin",
        headers:{
            'content-type':"application/json",
        },
        body:JSON.stringify(data)
    })
}

function Submit(){
    let User = document.getElementById("User").value;
    let Amount = document.getElementById("Amount").value;
    let From = document.getElementById("Transfer").getAttribute("data-nav"); 
    const data={
        User:User,
        Amount:Amount,
        From:From
    }
    postdata("/Transfer",data);

}

function Transfer(e){
    document.getElementById("Transfer").setAttribute("style","display:block;text-align:-moz-center;")
    document.getElementById("View").setAttribute("style","display:none")
    console.log(e.target.getAttribute('data-nav'))
    document.getElementById("Transfer").setAttribute("data-nav",e.target.getAttribute('data-nav'))
    document.getElementsByClassName('navbar')[0].removeEventListener('click',getdiv)    
}
function Close(){
    document.getElementsByClassName('closebtn')[0].parentElement.parentElement.style.display='none';
    document.getElementsByClassName('navbar')[0].addEventListener("click", getdiv);
    var div = document.getElementById("View");
    div.setAttribute("style", "display:block");
    var active = document.getElementById("view");
    active.setAttribute('class', "your-active-class")
}

let hide = document.querySelector("#about");
document.getElementById(hide.getAttribute("data-nav")).setAttribute("style", "display:none");

document.getElementsByClassName('navbar')[0].addEventListener("click", getdiv)
for(Btn of document.getElementsByClassName('TransferBtn')){
    Btn.addEventListener('click',Transfer)
}