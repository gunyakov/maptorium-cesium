var toastTrigger=document.getElementById("liveToastBtn"),
toastLiveExample=document.getElementById("liveToast");
toastTrigger&&toastTrigger.addEventListener("click",function(){new bootstrap.Toast(toastLiveExample).show()});
var toastTrigger2=document.getElementById("borderedToast1Btn"),
toastLiveExample2=document.getElementById("borderedToast1");
toastTrigger2&&toastTrigger2.addEventListener("click",function(){new bootstrap.Toast(toastLiveExample2).show()});
var toastTrigger3=document.getElementById("borderedToast2Btn"),
toastLiveExample3=document.getElementById("borderedToast2");
toastTrigger3&&toastTrigger3.addEventListener("click",function(){new bootstrap.Toast(toastLiveExample3).show()});
var toastTrigger4=document.getElementById("borderedTost3Btn"),
toastLiveExample4=document.getElementById("borderedTost3");
toastTrigger4&&toastTrigger4.addEventListener("click",function(){new bootstrap.Toast(toastLiveExample4).show()});
var toastTrigger5=document.getElementById("borderedToast4Btn"),
toastLiveExample5=document.getElementById("borderedToast4");
toastTrigger5&&toastTrigger5.addEventListener("click",function(){new bootstrap.Toast(toastLiveExample5).show()}),
toastPlacement=document.getElementById("toastPlacement"),
toastPlacement&&document.getElementById("selectToastPlacement").addEventListener("change",function(){toastPlacement.dataset.originalClass||(toastPlacement.dataset.originalClass=toastPlacement.className),toastPlacement.className=toastPlacement.dataset.originalClass+" "+this.value}),document.querySelectorAll(".bd-example .toast").forEach(function(t){new bootstrap.Toast(t,{autohide:!1}).show()});