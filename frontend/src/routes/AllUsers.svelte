<script>
    import tokenStore from "../stores/token";
    import router from "page";



    let selectedDepartment="";

    let items = [];
    let targetURLUsers = 'http://localhost:3000/users';
    let targetURLBookings='http://localhost:3000/bookings';
    let distinctDepartments=[];
    let department='';

    let today = new Date().toISOString().split("T")[0];


    /**
     * decode the token into payload
     * declaration of reference: this function comes directly from: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
     * @param token
     * @returns {any}
     */
    function parseJwt (token) {
        if (token != ''){
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        }
    }


    function getDistinctForDropDownItems(){
        for (let item of items) {
            if(!distinctDepartments.includes(item.department)){
                distinctDepartments.push(item.department);
                distinctDepartments=distinctDepartments;
            }
        }

    }


    async function getEmployees (department) {
        items=[];
        let targetURLUsersUseQuery=targetURLUsers;
        if(department!=''){
            targetURLUsersUseQuery+=('?department='+department);
        }

        console.log("query is "+targetURLUsersUseQuery);

        try {
            const resp = await fetch(targetURLUsersUseQuery, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'authorization': 'Bearer '+$tokenStore.token
                }
            });
            let tempItems = await resp.json();
            for (const tempItem of tempItems) {

                    items.push(tempItem);
                    items=items;


            }

        }catch (e){
            console.error(e);
        }
        getDistinctForDropDownItems();
    }

    getEmployees('');


    let emailForReservation='';
    let dateForReservation='';
    let isMorningShiftForReservation=false;
    function setEmailForReservation(email){
        emailForReservation=email;
        console.log("email set for reservation"+emailForReservation);
    }

    async function addReservation(){
        console.log('email for reservation  '+emailForReservation);
        console.log('dateForReservation '+dateForReservation);
        console.log('ismorning shift for reservation '+isMorningShiftForReservation);
        console.log('token'+$tokenStore.token);
        await fetch(targetURLBookings,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+$tokenStore.token
            },
            body:JSON.stringify(
                {
                    userEmail: emailForReservation,
                    shiftDate: dateForReservation,
                    isMorningShift: isMorningShiftForReservation
                }
            )
        }).then(async (res) => {
            if (res.ok) {

                router.redirect('/admin-page');
                router.redirect('/all-user');
                console.log("Success!");
            } else {
                res.json().then((body) => {
                    alert(body.message || "Internal error");
                });
            }
        })
            .catch(async (err) => {
                alert(err)
            });


    }




    async function deleteEmployee(email) {
        await fetch(targetURLUsers + '/' + email, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'authorization': 'Bearer ' + $tokenStore.token
            }
        })
            .then(async (res) => {
                if (res.ok) {

                    router.redirect('/admin-page');
                    router.redirect('/all-users');

                    console.log("Success!");
                } else {
                    res.json().then((body) => {
                        alert(body.message || "Internal error");
                    });
                }
            })
            .catch(async (err) => {
                alert(err);
            });
    }


    let departmentForEdit;
    let phoneForEdit;
    let nameForEdit;
    let emailForEidt;
    function setInfoForEdit(item){
        departmentForEdit=item.department;
        phoneForEdit=item.phone;
        nameForEdit=item.name;
        emailForEidt=item.email;
    }

    async function editEmployee() {
        console.log('name for editing'+nameForEdit);
        console.log('department for editing'+departmentForEdit);
        console.log('phone for editing'+phoneForEdit);
        console.log('email for editing'+emailForEidt);
        await fetch(targetURLUsers+'/'+emailForEidt, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + $tokenStore.token
            },
            body: JSON.stringify(
                {
                    department:departmentForEdit,
                    name:nameForEdit,
                    phone:phoneForEdit
                }
            )
        }).then(async (res) => {
            if (res.ok) {

                router.redirect('/admin-page');
                router.redirect('/all-users');

                console.log("Success!");
            } else {
                res.json().then((body) => {
                    alert(body.message || "Internal error");
                });
            }
        })
            .catch(async (err) => {
                alert(err);
            });


    }






    //add employee
    let nameForAdding,departmentForAdding,phoneForAdding,passwordForAdding;
    let emailForAdding="";
    async function addEmployee() {
        console.log("ohone for addiing"+phoneForAdding);
        await fetch(targetURLUsers , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + $tokenStore.token
            },
            body: JSON.stringify(
                {
                    name: nameForAdding,
                    department: departmentForAdding,
                    phone: phoneForAdding,
                    email:emailForAdding,
                    password:passwordForAdding
                }
            )
        }).then(async (res) => {
            if (res.ok) {

                router.redirect('/admin-page');
                router.redirect('/all-users');

                console.log("Success!");
            } else {
                res.json().then((body) => {
                    alert(body.message || "Internal error");
                });
            }
        })
            .catch(async (err) => {
                alert(err);
            });
    }


    let myEmail='';
    let myName='';
    let myDepartment=''
    let targetURLGetMyself='http://localhost:3000/users/'+parseJwt($tokenStore.token).email;
    async function getMyInfo() {
        console.log("getMyInfo called");
        try {
            const resp = await fetch(targetURLGetMyself, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'authorization': 'Bearer ' + $tokenStore.token
                }
            });
            let tempItems = await resp.json();
            myEmail=tempItems[0].email;
            myName=tempItems[0].name;
            myDepartment=tempItems[0].department;

        } catch (e) {
            console.error(e);
        }
    }



</script>

<body id="page-top">
<div id="wrapper">
    <nav class="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0">
        <div class="container-fluid d-flex flex-column p-0">
            <a class="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href=""
               style="padding-top: 36px;">
                <div class="sidebar-brand-icon rotate-n-15">
                    <i class="far fa-calendar-alt"></i>
                </div>
                <div class="sidebar-brand-text mx-3">
                    <span style="font-size: 25px;">Planion
                        <br>
                    </span>
                    <span
                            class="text-capitalize" style="font-size: 12px;font-family: 'Bad Script', serif;">Start planning today!
                        <br>&nbsp;
                    </span>
                </div>
            </a>
            <ul class="navbar-nav text-light" id="accordionSidebar" style="margin-top: 16px;">
                {#if ($tokenStore.token != '')}

                    {#if (parseJwt($tokenStore.token).role.includes('admin'))}
                        <li class="nav-item">
                            <a class="nav-link" href="/admin-page">
                                <i class="fas fa-calendar-check"></i>
                                <span>All reservations</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/all-users">
                                <i class="fas fa-id-card-alt"></i>

                                <span>All employees</span>
                            </a>
                        </li>
                    {/if}
                {/if}
                <li class="nav-item">
                    <a on:click={$tokenStore.token = ''} class="nav-link" href="/login">
                        <i class="far fa-user-circle"></i>
                        <span>Log out</span>
                    </a>
                </li>
            </ul>
            <div class="text-center d-none d-md-inline">
                <button class="btn rounded-circle border-0" id="sidebarToggle" type="button"></button>
            </div>
        </div>
    </nav>
    <div class="d-flex flex-column" id="content-wrapper">
        <div id="content">
            <nav class="navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top">
                <div class="container-fluid">
                    <button class="btn btn-link d-md-none rounded-circle me-3" id="sidebarToggleTop" type="button">
                        <i class="fas fa-bars"></i>
                    </button>

                    <ul class="navbar-nav flex-nowrap ms-auto">
                        <li class="nav-item">
                            <a on:click={getMyInfo} class="nav-link oneLine" data-bs-target="#modal-4" data-bs-toggle="modal"  >
                                {#if $tokenStore.token != ''}
                                    {parseJwt($tokenStore.token).email}
                                {/if}
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <h3 class="text-dark d-table mb-0">Welcome
                            {#if ($tokenStore.token != '')}
                                {parseJwt($tokenStore.token).name}
                            {/if}
                        </h3>
                    </div>
                    <div class="col-12" style="margin-bottom: 5px;">
                        <h4>Here is a list of employees.</h4>
                        <h4 class="text-dark" style="margin-bottom: 13px;">Add a employee here&nbsp;
                            <button
                                    class="btn btn-primary border rounded-circle justify-content-xl-center align-items-xl-center"
                                    id="add-button" type="button" style="border-radius: 0;" data-bs-target="#modal-add-employee"
                                    data-bs-toggle="modal">
                                <i class="fas fa-plus"></i>
                            </button>
                        </h4>
                    </div>

                </div>
                <div class="row">
                    <div class="col  mt-2" style="margin-left: 1%">
                        Department:
                        <select class="btn btn-primary text-capitalize shadow-sm "  bind:value={selectedDepartment} on:change="{() => {department = selectedDepartment}}" on:change={getEmployees(department)}>
                            <option value="">
                                (no preference)
                            </option>
                            {#each distinctDepartments as item}
                                <option value={item}>
                                    {item}
                                </option>
                            {/each}
                        </select>
                    </div>


                </div>
                <div class="row">
                    <div class="col">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                <tr class="text-center">
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Phone</th>
                                    <th>Email</th>

                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody class="text-center">

                                {#each items as item}

                                        <tr>
                                            <td>{item.name}</td>
                                            <td>{item.department}</td>
                                            <td>{item.phone}</td>
                                            <td class="justify-content-xl-center align-items-xl-center">{item.email}</td>

                                            {#if item.role.includes('admin')}
                                                <td>
                                                    <button on:click={setEmailForReservation(item.email)} class="btn btn-primary shadow-sm disabled" type="button"
                                                            data-bs-target="#modal-1" data-bs-toggle="modal">Assign a Reservation
                                                    </button>
                                                </td>
                                            {:else}
                                                <td>
                                                    <button on:click={setEmailForReservation(item.email)} class="btn btn-primary shadow-sm" type="button"
                                                            data-bs-target="#modal-1" data-bs-toggle="modal">Assign a Reservation
                                                    </button>
                                                </td>
                                            {/if}



                                            <td>
                                                <button on:click={setInfoForEdit(item)} class="btn btn-primary shadow-sm" type="button"
                                                        data-bs-target="#modal-2" data-bs-toggle="modal">Edit Info
                                                </button>
                                            </td>


                                            {#if item.role.includes('admin')}
                                                <td>
                                                    <button on:click={deleteEmployee(item.email)} class="btn btn-primary shadow-sm btn-danger disabled" type="button "
                                                            data-bs-toggle="modal">Delete Employee
                                                    </button>
                                                </td>
                                            {:else}
                                                <td>
                                                    <button on:click={deleteEmployee(item.email)} class="btn btn-primary shadow-sm btn-danger" type="button "
                                                            data-bs-toggle="modal">Delete Employee
                                                    </button>
                                                </td>
                                            {/if}

                                        </tr>

                                {/each}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="bg-white d-xl-flex justify-content-xl-center align-items-xl-end sticky-footer">
            <div class="container my-auto">
                <div class="text-center my-auto copyright"><span>Copyright © Planion 2021</span></div>
            </div>
        </footer>
    </div>
    <a class="border rounded d-inline scroll-to-top" href="#page-top"><i class="fas fa-angle-up"></i></a></div>
<div class="modal fade" role="dialog" tabindex="-1" id="modal-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header"><h4 class="modal-title"></h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                <form>
                    <input min={today} bind:value={dateForReservation} class="form-control oneLine" id="date" type="date" name="date" required>
                    Is morning shift:
                    <input type="checkbox"  name="scales"
                           bind:checked="{isMorningShiftForReservation}">
                </form>
            </div>
            <div class="modal-footer">
                <button on:click={addReservation} class="btn btn-primary" data-bs-dismiss="modal">Save</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" role="dialog" tabindex="-1" id="modal-2">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header"><h4 class="modal-title">Please Edit the info</h4>
                <!--
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                -->
            </div>
            <div class="modal-body">
                <form>
                   name: <input bind:value={nameForEdit} class="form-control"    required="true">
                    department: <input bind:value={departmentForEdit} class="form-control"   required="true">
                    phone: <input bind:value={phoneForEdit} class="form-control"   required="true">

                </form>
            </div>
            <div class="modal-footer">
                <button on:click={editEmployee} class="btn btn-primary"  data-bs-dismiss="modal">Save</button>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" role="dialog" tabindex="-1" id="modal-add-employee">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header"><h4 class="modal-title">Add employee</h4>
                <!--
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                -->
            </div>
            <div class="modal-body">
                <form>
                    <h4>Please enter employee info</h4>
                    name: <input bind:value={nameForAdding} class="form-control"    required="true">
                    department: <input bind:value={departmentForAdding} class="form-control"   required="true">
                    phone: <input bind:value={phoneForAdding} class="form-control"   required="true">
                    email: <input bind:value={emailForAdding} class="form-control" autocomplete="autocomplete_off_hack_xfr4!k"  required="true">
                    password: <input bind:value={passwordForAdding} class="form-control"  type="password" required="true">
                </form>
            </div>
            <div class="modal-footer">
                <button on:click={addEmployee} class="btn btn-primary"  data-bs-dismiss="modal">Add Employee</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" role="dialog" tabindex="-1" id="modal-4" aria-hidden="true" aria-labelledby="modal-4label">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header"><h4 class="modal-title">Your info</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>

                    <h3>Name: {myName}</h3>
                    <h3>Department: {myDepartment}</h3>
                    <h3>Email: {myEmail}</h3>

                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-danger" type="button" data-bs-dismiss="modal">Close</button>

            </div>
        </div>
    </div>
</div>

<script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
<script defer src="assets/js/script.min.js"></script>

</body>

<style>
    .notAvailable {
        cursor: not-allowed;
    }
</style>