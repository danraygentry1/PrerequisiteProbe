import { addNewTask, updateTask } from './server'

(async function myfunc(){
    await addNewTask({
        name:"my task",
        id:"12346"
    });

    await updateTask({
        id:"12346",
        name:"My task - UPDATED!!!!"
    })

})();
// () invokes my myfunc function