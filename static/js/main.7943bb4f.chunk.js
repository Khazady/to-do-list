(this["webpackJsonpit-incubator-todolist-ts"]=this["webpackJsonpit-incubator-todolist-ts"]||[]).push([[0],{140:function(t,e,n){t.exports=n(189)},145:function(t,e,n){},166:function(t,e,n){},189:function(t,e,n){"use strict";n.r(e);var a,r,o=n(0),i=n.n(o),c=n(10),l=n.n(c),u=(n(145),n(14)),s=n(52),d=n(8),m=n(79),f=n(116),b=n.n(f).a.create({withCredentials:!0,baseURL:"https://social-network.samuraijs.com/api/1.1/",headers:{"API-KEY":"a13d3464-2e9e-4272-8cbf-d0d1a9048e02"}}),E=function(){return b.get("todo-lists").then((function(t){return t.data}))},O=function(t){return b.post("todo-lists",{title:t}).then((function(t){return t.data}))},p=function(t){return b.delete("todo-lists/".concat(t)).then((function(t){return t.data}))},g=function(t,e){return b.put("todo-lists/".concat(t),{title:e}).then((function(t){return t.data}))},h=function(t){return b.get("todo-lists/".concat(t,"/tasks")).then((function(t){return t.data}))},j=function(t,e){return b.post("todo-lists/".concat(t,"/tasks"),{title:e}).then((function(t){return t.data}))},T=function(t,e){return b.delete("todo-lists/".concat(t,"/tasks/").concat(e)).then((function(t){return t.data}))},I=function(t,e,n){return b.put("todo-lists/".concat(t,"/tasks/").concat(e),n).then((function(t){return t.data}))},v=function(t){return b.post("auth/login",t).then((function(t){return t.data}))},S=function(){return b.get("auth/me").then((function(t){return t.data}))},k=function(){return b.delete("auth/login").then((function(t){return t.data}))};!function(t){t[t.New=0]="New",t[t.InProgress=1]="InProgress",t[t.Completed=2]="Completed",t[t.Draft=3]="Draft"}(a||(a={})),function(t){t[t.Low=0]="Low",t[t.Middle=1]="Middle",t[t.High=2]="High",t[t.Urgently=3]="Urgently",t[t.Later=4]="Later"}(r||(r={}));var y=function(t,e){t.messages.length?e(P(t.messages[0])):e(P("Some error occurred")),e(w("failed"))},C=function(t,e){e(P(t.message?t.message:"Some error occurred")),e(w("failed"))},A={isLoggedIn:!1},D=function(t){return{type:"login/SET-IS-LOGGED-IN",value:t}},L={status:"idle",error:null,isInitialized:!1},w=function(t){return{type:"APP/SET-STATUS",status:t}},P=function(t){return{type:"APP/SET-ERROR",error:t}},N=function(t){return{type:"APP/SET-IS-INITIALIZED",isInitialized:t}},R=[],G=n(40),K={},M=function(t,e,n){return function(a,r){a(w("loading"));var o=r().tasks[t].find((function(t){return t.id===e}));if(o){var i=Object(d.a)({deadline:o.deadline,description:o.description,priority:o.priority,startDate:o.startDate,status:o.status,title:o.title},n);I(t,e,i).then((function(r){0===r.resultCode?(a(function(t,e,n){return{type:"UPDATE-TASK",taskId:e,todolistId:t,model:n}}(t,e,n)),a(w("succeeded"))):y(r,a)})).catch((function(t){return C(t,a)}))}else console.warn("task was not found in the state")}},U=n(117),x=Object(s.c)({todolists:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:R,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case"REMOVE-TODOLIST":return t.filter((function(t){return t.id!==e.id}));case"ADD-TODOLIST":return[Object(d.a)(Object(d.a)({},e.todolist),{},{filter:"all",entityStatus:"idle"})].concat(Object(m.a)(t));case"CHANGE-TODOLIST-TITLE":return t.map((function(t){return t.id===e.id?Object(d.a)(Object(d.a)({},t),{},{title:e.title}):t}));case"CHANGE-TODOLIST-FILTER":return t.map((function(t){return t.id===e.id?Object(d.a)(Object(d.a)({},t),{},{filter:e.filter}):t}));case"SET-TODOLISTS":return e.todolists.map((function(t){return Object(d.a)(Object(d.a)({},t),{},{filter:"all",entityStatus:"idle"})}));case"CHANGE-TODOLIST-ENTITY-STATUS":return t.map((function(t){return t.id===e.id?Object(d.a)(Object(d.a)({},t),{},{entityStatus:e.entityStatus}):t}));default:return t}},tasks:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:K,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case"REMOVE-TASK":return Object(d.a)(Object(d.a)({},t),{},Object(G.a)({},e.todolistId,t[e.todolistId].filter((function(t){return t.id!==e.taskId}))));case"ADD-TASK":return Object(d.a)(Object(d.a)({},t),{},Object(G.a)({},e.task.todoListId,[e.task].concat(Object(m.a)(t[e.task.todoListId]))));case"UPDATE-TASK":return Object(d.a)(Object(d.a)({},t),{},Object(G.a)({},e.todolistId,t[e.todolistId].map((function(t){return t.id===e.taskId?Object(d.a)(Object(d.a)({},t),e.model):t}))));case"ADD-TODOLIST":return Object(d.a)(Object(d.a)({},t),{},Object(G.a)({},e.todolist.id,[]));case"REMOVE-TODOLIST":var n=Object(d.a)({},t);return delete n[e.id],n;case"SET-TODOLISTS":var a=Object(d.a)({},t);return e.todolists.forEach((function(t){a[t.id]=[]})),a;case"SET-TASKS":return Object(d.a)(Object(d.a)({},t),{},Object(G.a)({},e.todolistId,e.tasks));default:return t}},app:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:L,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case"APP/SET-STATUS":return Object(d.a)(Object(d.a)({},t),{},{status:e.status});case"APP/SET-ERROR":return Object(d.a)(Object(d.a)({},t),{},{error:e.error});case"APP/SET-IS-INITIALIZED":return Object(d.a)(Object(d.a)({},t),{},{isInitialized:e.isInitialized});default:return t}},auth:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:A,e=arguments.length>1?arguments[1]:void 0;switch(e.type){case"login/SET-IS-LOGGED-IN":return Object(d.a)(Object(d.a)({},t),{},{isLoggedIn:e.value});default:return t}}}),F=Object(s.d)(x,Object(s.a)(U.a));window.store=F;n(166);var H=n(228),V=n(229),z=n(220),Z=n(126),q=n(195),Y=n(194),B=n(230),J=n(225),_=n(193),$=n(54),Q=n(231),W=n(221),X=i.a.memo((function(t){console.log("AddItemForm rendered");var e=Object(o.useState)(""),n=Object($.a)(e,2),a=n[0],r=n[1],c=Object(o.useState)(null),l=Object($.a)(c,2),u=l[0],s=l[1],d=function(){""!==a.trim()?(t.addItem(a),r("")):s("Title is not required")};return i.a.createElement("div",null,i.a.createElement(Q.a,{value:a,onChange:function(t){r(t.currentTarget.value),s(null)},onKeyPress:function(t){null!==u&&s(null),13===t.charCode&&d()},variant:"outlined",error:!!u,label:"Title",helperText:u,disabled:t.disabled}),i.a.createElement(z.a,{color:"primary",onClick:d,disabled:t.disabled},i.a.createElement(W.a,null)))})),tt=n(127),et=n(223),nt=n(222),at=n(224),rt=n(233),ot=i.a.memo((function(t){console.log("EditableSpan is called");var e=Object(o.useState)(!1),n=Object($.a)(e,2),a=n[0],r=n[1],c=Object(o.useState)(""),l=Object($.a)(c,2),u=l[0],s=l[1],d=function(){r(!1),t.onChange(u)};return a?i.a.createElement(Q.a,{value:u,autoFocus:!0,onBlur:function(){return d()},onChange:function(t){return s(t.currentTarget.value)},onKeyPress:function(t){return 13===t.charCode&&d()}}):i.a.createElement("span",{onDoubleClick:function(){t.disabled?r(!1):(r(!0),s(t.title))}},t.title)})),it=i.a.memo((function(t){var e=Object(u.b)(),n=Object(o.useCallback)((function(){var n,a;e((n=t.todolistId,a=t.task.id,function(t){t(w("loading")),T(n,a).then((function(e){if(0===e.resultCode){var r=function(t,e){return{type:"REMOVE-TASK",todolistId:t,taskId:e}}(n,a);t(r),t(w("succeeded"))}else y(e,t)})).catch((function(e){return C(e,t)}))}))}),[e,t.task.id,t.todolistId]),r=Object(o.useCallback)((function(n){var r=n.currentTarget.checked;e(M(t.todolistId,t.task.id,{status:r?a.Completed:a.New}))}),[e,t.task.id,t.todolistId]),c=Object(o.useCallback)((function(n){return e(M(t.todolistId,t.task.id,{title:n}))}),[e,t.task.id,t.todolistId]);return i.a.createElement("li",{key:t.task.id,className:"completed"!==t.filter&&t.task.status===a.Completed?"is-done":""},i.a.createElement(rt.a,{checked:t.task.status===a.Completed,onChange:r,color:"primary",disabled:t.disabled}),i.a.createElement(ot,{title:t.task.title,onChange:c,disabled:t.disabled}),i.a.createElement(z.a,{onClick:n,disabled:t.disabled},i.a.createElement(nt.a,null)))})),ct=i.a.memo((function(t){var e=t.demo,n=void 0!==e&&e,r=Object(tt.a)(t,["demo"]);console.log("Todolist is called");var c,l=Object(u.b)(),s=Object(u.c)((function(t){return t.tasks[r.todolist.id]}));switch(r.todolist.filter){case"active":c=s.filter((function(t){return t.status===a.New}));break;case"completed":c=s.filter((function(t){return t.status===a.Completed}));break;default:c=s}var d=Object(o.useCallback)((function(t){return l(function(t,e){return function(n){n(w("loading")),j(t,e).then((function(t){0===t.resultCode?(n({type:"ADD-TASK",task:t.data.item}),n(w("succeeded"))):y(t,n)})).catch((function(t){return C(t,n)}))}}(r.todolist.id,t))}),[l,r.todolist.id]),m=Object(o.useCallback)((function(){return l((t=r.todolist.id,function(e){e({type:"CHANGE-TODOLIST-ENTITY-STATUS",id:t,entityStatus:"loading"}),e(w("loading")),p(t).then((function(n){0===n.resultCode?(e(function(t){return{type:"REMOVE-TODOLIST",id:t}}(t)),e(w("succeeded"))):y(n,e)})).catch((function(t){return C(t,e)}))}));var t}),[l,r.todolist.id]),f=Object(o.useCallback)((function(t){var e,n,a=(e=r.todolist.id,n=t,function(t){t(w("loading")),g(e,n).then((function(a){0===a.resultCode?(t(function(t,e){return{type:"CHANGE-TODOLIST-TITLE",id:t,title:e}}(e,n)),t(w("succeeded"))):(a.messages.length?t(P(a.messages[0])):t(P("Some error occurred")),t(w("failed")))})).catch((function(e){return C(e,t)}))});l(a)}),[l,r.todolist.id]),b=Object(o.useCallback)((function(t,e){return l(function(t,e){return{type:"CHANGE-TODOLIST-FILTER",id:t,filter:e}}(r.todolist.id,e))}),[l,r.todolist.id]);return Object(o.useEffect)((function(){var t;n||l((t=r.todolist.id,function(e){e(w("loading")),h(t).then((function(n){e(function(t,e){return{type:"SET-TASKS",tasks:t,todolistId:e}}(n.items,t)),e(w("succeeded"))}))}))}),[l,r.todolist.id]),i.a.createElement("div",null,i.a.createElement("h3",null,i.a.createElement(ot,{title:r.todolist.title,onChange:f,disabled:"loading"===r.todolist.entityStatus}),i.a.createElement(z.a,{onClick:m,disabled:"loading"===r.todolist.entityStatus},i.a.createElement(nt.a,null))),i.a.createElement(X,{addItem:d,disabled:"loading"===r.todolist.entityStatus}),i.a.createElement("ul",null,c.map((function(t){return i.a.createElement(it,{task:t,filter:r.todolist.filter,todolistId:r.todolist.id,key:t.id,disabled:"loading"===r.todolist.entityStatus})}))),i.a.createElement("div",null,i.a.createElement(et.a,null,i.a.createElement(Y.a,{onClick:function(){return b(r.todolist.id,"all")},variant:"all"===r.todolist.filter?"contained":"outlined",color:"primary",endIcon:i.a.createElement(at.a,null)},"All"),i.a.createElement(Y.a,{onClick:function(){return b(r.todolist.id,"active")},variant:"active"===r.todolist.filter?"contained":"outlined",color:"inherit"},"Active"),i.a.createElement(Y.a,{onClick:function(){return b(r.todolist.id,"completed")},variant:"completed"===r.todolist.filter?"contained":"outlined",color:"secondary"},"Completed"))))})),lt=n(15),ut=i.a.memo((function(t){var e=t.demo,n=void 0!==e&&e,a=Object(u.b)(),r=Object(u.c)((function(t){return t.todolists})),c=Object(u.c)((function(t){return t.auth.isLoggedIn})),l=Object(o.useCallback)((function(t){return a(function(t){return function(e){e(w("loading")),O(t).then((function(t){0===t.resultCode?(e({type:"ADD-TODOLIST",todolist:t.data.item}),e(w("succeeded"))):y(t,e)})).catch((function(t){return C(t,e)}))}}(t))}),[a]);return Object(o.useEffect)((function(){!n&&c&&a((function(t){t(w("loading")),E().then((function(e){t({type:"SET-TODOLISTS",todolists:e}),t(w("succeeded"))})).catch((function(e){return C(e,t)}))}))}),[a]),c?i.a.createElement(i.a.Fragment,null,i.a.createElement(J.a,{container:!0,style:{padding:"20px"}},i.a.createElement(X,{addItem:l})),i.a.createElement(J.a,{container:!0,spacing:3},r.map((function(t){return i.a.createElement(J.a,{item:!0,key:t.id},i.a.createElement(_.a,{style:{padding:"10px"}},i.a.createElement(ct,{todolist:t,demo:n})))})))):i.a.createElement(lt.a,{to:"/to-do-list/login"})})),st=n(124),dt=n.n(st),mt=n(235),ft=n(232);function bt(t){return i.a.createElement(ft.a,Object.assign({elevation:6,variant:"filled"},t))}function Et(){var t=Object(u.c)((function(t){return t.app.error})),e=Object(u.b)(),n=function(t,n){"clickaway"!==n&&e(P(null))},a=null!==t;return i.a.createElement(mt.a,{open:a,autoHideDuration:3e3,onClose:n},i.a.createElement(bt,{onClose:n,severity:"error"},t))}var Ot=n(236),pt=n(219),gt=n(226),ht=n(227),jt=n(125),Tt=function(){var t=Object(u.b)(),e=Object(jt.a)({initialValues:{email:"",password:"",rememberMe:!1},validate:function(t){var e={};return t.email?/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(t.email)||(e.email="Invalid email address"):e.email="Email is required",t.password?t.password.length<4&&(e.password="Password must be at least 4 characters"):e.password="Password is required",e},onSubmit:function(e){var n;t((n=e,function(t){t(w("loading")),v(n).then((function(e){0===e.resultCode?(t(D(!0)),t(w("succeeded"))):y(e,t)})).catch((function(e){return C(e,t)}))}))}});return Object(u.c)((function(t){return t.auth.isLoggedIn}))?i.a.createElement(lt.a,{to:"/to-do-list"}):i.a.createElement(J.a,{container:!0,justify:"center"},i.a.createElement(J.a,{item:!0,xs:4},i.a.createElement("form",{onSubmit:e.handleSubmit},i.a.createElement(Ot.a,null,i.a.createElement(pt.a,null,i.a.createElement("p",null,"To log in get registered",i.a.createElement("a",{href:"https://social-network.samuraijs.com/",target:"_blank"},"here")),i.a.createElement("p",null,"or use common test account credentials:"),i.a.createElement("p",null,"Email: free@samuraijs.com"),i.a.createElement("p",null,"Password: free")),i.a.createElement(gt.a,null,i.a.createElement(Q.a,Object.assign({label:"Email",margin:"normal"},e.getFieldProps("email"))),e.errors.email?i.a.createElement("div",{style:{color:"red"}},e.errors.email):null,i.a.createElement(Q.a,Object.assign({type:"password",label:"Password",margin:"normal"},e.getFieldProps("password"))),e.errors.password?i.a.createElement("div",{style:{color:"red"}},e.errors.password):null,i.a.createElement(ht.a,{label:"Remember me",control:i.a.createElement(rt.a,Object.assign({},e.getFieldProps("rememberMe"),{checked:e.values.rememberMe}))}),i.a.createElement(Y.a,{type:"submit",variant:"contained",color:"primary"},"Login"))))))},It=n(123),vt=n.n(It);var St=function(t){var e=t.demo,n=void 0!==e&&e,a=Object(u.b)(),r=Object(u.c)((function(t){return t.app.status})),c=Object(u.c)((function(t){return t.app.isInitialized})),l=Object(u.c)((function(t){return t.auth.isLoggedIn}));Object(o.useEffect)((function(){a((function(t){S().then((function(e){0===e.resultCode?t(D(!0)):y(e,t),t(N(!0))})).catch((function(e){C(e,t),t(N(!0))}))}))}),[]);var s=Object(o.useCallback)((function(){return a((function(t){t(w("loading")),k().then((function(e){0===e.resultCode?(t(D(!1)),t(w("succeeded"))):y(e,t)})).catch((function(e){C(e,t)}))}))}),[]);return c?i.a.createElement("div",{className:"App"},i.a.createElement(H.a,{position:"static"},i.a.createElement(V.a,null,i.a.createElement(z.a,{edge:"start",color:"inherit","aria-label":"menu"},i.a.createElement(Z.a,{open:!1})),i.a.createElement(q.a,{variant:"h6"},"News"),l&&i.a.createElement(Y.a,{color:"inherit",onClick:s},"Log out"))),"loading"===r&&i.a.createElement("div",{className:"progress-bar"},i.a.createElement(dt.a,{color:"secondary"})),i.a.createElement(B.a,{fixed:!0},i.a.createElement(lt.d,null,i.a.createElement(lt.b,{exact:!0,path:"/to-do-list",render:function(){return i.a.createElement(ut,{demo:n})}}),i.a.createElement(lt.b,{path:"/to-do-list/login",render:function(){return i.a.createElement(Tt,null)}}),i.a.createElement(lt.b,{path:"/to-do-list/404",render:function(){return i.a.createElement("h1",null,"404: PAGE NOT FOUND")}}),i.a.createElement(lt.a,{from:"*",to:"/to-do-list/404"}))),i.a.createElement(Et,null)):i.a.createElement("div",{style:{position:"fixed",top:"30%",textAlign:"center",width:"100%"}},i.a.createElement(vt.a,null))},kt=n(57);l.a.render(i.a.createElement(u.a,{store:F},i.a.createElement(kt.a,null,i.a.createElement(St,null))),document.getElementById("root"))}},[[140,1,2]]]);
//# sourceMappingURL=main.7943bb4f.chunk.js.map