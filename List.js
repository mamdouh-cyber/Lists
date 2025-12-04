let CB = document.getElementById('create');
let DB = document.getElementById('Delete');

let List_1 = document.getElementById('List_1');
let List_2 = document.getElementById('List_2');
let List_3 = document.getElementById('List_3');
let List_4 = document.getElementById('List_4');
let List_5 = document.getElementById('List_5');
let List_6 = document.getElementById('List_6');
let List_7 = document.getElementById('List_7');
let List_8 = document.getElementById('List_8');
let List_9 = document.getElementById('List_9');
let List_10 = document.getElementById('List_10');
let List_11 = document.getElementById('List_11');
let List_12 = document.getElementById('List_12');
let List_13 = document.getElementById('List_13');
let List_14 = document.getElementById('List_14');
let List_15 = document.getElementById('List_15');
let List_16 = document.getElementById('List_16');
let List_17 = document.getElementById('List_17');
let List_18 = document.getElementById('List_18');
let List_19 = document.getElementById('List_19');
let List_20 = document.getElementById('List_20');
let List_21 = document.getElementById('List_21');
let List_22 = document.getElementById('List_22');
let List_23 = document.getElementById('List_23');
let List_24 = document.getElementById('List_24');
let List_25 = document.getElementById('List_25');
let List_26 = document.getElementById('List_26');
let List_27 = document.getElementById('List_27');
let List_28 = document.getElementById('List_28');
let List_29 = document.getElementById('List_29');
let List_30 = document.getElementById('List_30');

var display1 = 0;
var display2 = 0;
var display3 = 0;
var display4 = 0;
var display5 = 0;
var display6 = 0;
var display7 = 0;
var display8 = 0;
var display9 = 0;
var display10 = 0;
var display11 = 0;
var display12 = 0;
var display13 = 0;
var display14 = 0; 
var display15 = 0;
var display16 = 0;
var display17 = 0;
var display18 = 0;
var display19 = 0;
var display20 = 0;
var display21 = 0;
var display22 = 0;
var display23 = 0;
var display24 = 0;
var display25 = 0;
var display26 = 0;
var display27 = 0;
var display28 = 0;
var display29 = 0;
var display30 = 0;


function AddList() {
   if (display1 == 0) {
       List_1.style.display="block";
       display1 = 1;
       return display1;
   }else if (display2 == 0) {
       List_2.style.display="block";
       display2 = 1;  
       return display2;
   }else if (display3 == 0) {
       List_3.style.display="block";
       display3 = 1;  
       return display3;
   }else if (display4 == 0) {
       List_4.style.display="block";
       display4 = 1;  
       return display4;
   }else if (display5 == 0) {
       List_5.style.display="block";
       display5 = 1;  
       return display5;
   }else if (display6 == 0) {
       List_6.style.display="block";
       display6 = 1;  
       return display6;
   }else if (display7 == 0) {
       List_7.style.display="block";
       display7 = 1;  
       return display7;
   }else if (display8 == 0) {
       List_8.style.display="block";
       display8 = 1;  
       return display8;
   }else if (display9 == 0) {
       List_9.style.display="block";
       display9 = 1;  
       return display9;
   }else if (display10 == 0) {
       List_10.style.display="block";
       display10 = 1;  
       return display10;
   }else if (display11 == 0) {
       List_11.style.display="block";
       display11 = 1;  
       return display11;
   }else if (display12 == 0) {
       List_12.style.display="block";
       display12 = 1;  
       return display12;
   }else if (display13 == 0) {
       List_13.style.display="block";
       display13 = 1;  
       return display13;
   }else if (display14 == 0) {
       List_14.style.display="block";
       display14 = 1;  
       return display14;
   }else if (display15 == 0) {
       List_15.style.display="block";
       display15 = 1;  
       return display15;
   }else if (display16 == 0) {
       List_16.style.display="block";
       display16 = 1;  
       return display16;
   }else if (display17 == 0) {
       List_17.style.display="block";
       display17 = 1;  
       return display18;
   }else if (display18 == 0) {
       List_18.style.display="block";
       display18 = 1;  
       return display18;
   }else if (display19 == 0) {
       List_19.style.display="block";
       display19 = 1;  
       return display19;
   }else if (display20 == 0) {
       List_20.style.display="block";
       display20 = 1;  
       return display20;
   }else if (display21 == 0) {
       List_21.style.display="block";
       display21 = 1;  
       return display21;
   }else if (display22 == 0) {
       List_22.style.display="block";
       display22 = 1;  
       return display22;
   }else if (display23 == 0) {
       List_23.style.display="block";
       display23 = 1;  
       return display23;
   }else if (display24 == 0) {
       List_24.style.display="block";
       display24 = 1;  
       return display24;
   }else if (display25 == 0) {
       List_25.style.display="block";
       display25 = 1;  
       return display25;
   }else if (display26 == 0) {
       List_26.style.display="block";
       display26 = 1;  
       return display26;
   }else if (display27 == 0) {
       List_27.style.display="block";
       display27 = 1;  
       return display27;
   }else if (display28 == 0) {
       List_28.style.display="block";
       display28 = 1;  
       return display28;
   }else if (display29 == 0) {
       List_29.style.display="block";
       display29 = 1;  
       return display29;
   }else if (display30 == 0) {
       List_30.style.display="block";
       display30 = 1;  
       return display30;
   }else {
       alert("This is the maximum of number of lists");
   }
}
function DeleteList() {
    if (display1 == 1) {
        List_1.style.display="none";
        display1 = 0;
        return display1;
    }else if (display2 == 1) {
        List_2.style.display="none";
        display2 = 0;
        return display2;
    }else if (display3 == 1) {
        List_3.style.display="none";
        display3 = 0;
        return display3;
    }else if (display4 == 1) {
        List_4.style.display="none";
        display4 = 0;
        return display4;
    }else if (display5 == 1) {
        List_5.style.display="none";
        display5 = 0;
        return display5;
    }else if (display6 == 1) {
        List_6.style.display="none";
        display6 = 0;
        return display6;
    }else if (display7 == 1) {
        List_7.style.display="none";
        display7 = 0;
        return display7;
    }else if (display8 == 1) {
        List_8.style.display="none";
        display8 = 0;
        return display8;
    }else if (display9 == 1) {
        List_9.style.display="none";
        display9 = 0;
        return display9;
    }else if (display10 == 1) {
        List_10.style.display="none";
        display10 = 0;
        return display10;
    }else if (display11 == 1) {
        List_11.style.display="none";
        display11 = 0;
        return display11;
    }else if (display12 == 1) {
        List_12.style.display="none";
        display12 = 0;
        return display12;
    }else if (display13 == 1) {
        List_13.style.display="none";
        display13 = 0;
        return display13;
    }else if (display14 == 1) {
        List_14.style.display="none";
        display14 = 0;
        return display14;
    }else if (display15 == 1) {
        List_15.style.display="none";
        display15 = 0;
        return display15;
    }else if (display16 == 1) {
        List_16.style.display="none";
        display16 = 0;
        return display16;
    }else if (display17 == 1) {
        List_17.style.display="none";
        display17 = 0;
        return display17;
    }else if (display18 == 1) {
        List_18.style.display="none";
        display18 = 0;
        return display18;
    }else if (display19 == 1) {
        List_19.style.display="none";
        display19 = 0;
        return display19;
    }else if (display20 == 1) {
        List_20.style.display="none";
        display20 = 0;
        return display20;
    }else if (display21 == 1) {
        List_21.style.display="none";
        display21 = 0;
        return display21;
    }else if (display22 == 1) {
        List_22.style.display="none";
        display22 = 0;
        return display22;
    }else if (display23 == 1) {
        List_23.style.display="none";
        display23 = 0;
        return display23;
    }else if (display24 == 1) {
        List_24.style.display="none";
        display24 = 0;
        return display24;
    }else if (display25 == 1) {
        List_25.style.display="none";
        display25 = 0;
        return display25;
    }else if (display26 == 1) {
        List_26.style.display="none";
        display26 = 0;
        return display26;
    }else if (display27 == 1) {
        List_27.style.display="none";
        display27 = 0;
        return display27;
    }else if (display28 == 1) {
        List_28.style.display="none";
        display28 = 0;
        return display28;
    }else if (display29 == 1) {
        List_29.style.display="none";
        display29 = 0;
        return display29;
    }else if (display30 == 1) {
        List_30.style.display="none";
        display30 = 0;
        return display30;
    }
}
