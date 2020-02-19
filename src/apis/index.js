import Vue from 'vue'
const apis = {
    index:'/index',
    verify: '/verify',
    signin:'/signin',
    demo:'/index',

    teachers:'/teachers',
    deleteteacher:'/deleteteacher',
    updateteacher:'/updateteacher',
    addteacher:'/addteacher',

    students:'/students',
    deletestudent:"/deletestudent",
    updatestudent:"/updatestudent",
    addstudent:'/addstudent',

    manager:"/manager",
    deletemanager:'/deletemanager',
    updatemanager:'/updatemanager',
    addmanager:'/addmanager',


    building:'/building',
    deletebuilding:'/deletebuilding',
    updatebuilding:'/updatebuilding',
    addbuilding:'/addbuilding',

    laboratory:'/laboratory',
    olaboratory:'/olaboratory',
    deletelaboratory:'/deletelaboratory',
    updatestatus:'/updatestatus',
    addlaboratory:'/addlaboratory',

    equipments:'/equipments',
    addequipment:'/addequipment',
    updateequipment:'/updateequipment',
    deleteequipment:'/deleteequipment',

    experimental:'/experimental',
    quer:'/quer',


    queryequ:'/queryequ',
    isequ:'/isequ',
    inserequipment:'/inserequipment'



};

Vue.prototype.$apis = apis;
export default apis
