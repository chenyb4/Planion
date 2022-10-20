<script>
    import tokenStore from "../stores/token";
    import router from "page";

    let targetURL = 'http://localhost:3000/bookings';
    let targetURLUsers='http://localhost:3000/users';


    let items = [];
    let itemsToDisplay=[];
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

    async function getBookings () {
        try {
            const resp = await fetch(targetURL, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'authorization': 'Bearer '+$tokenStore.token
                }
            });
            items = await resp.json();
            console.log("items:");
            console.log(items);
            for (const item of items) {
                if(item.userEmail==parseJwt($tokenStore.token).email){
                    itemsToDisplay.push(item);
                    itemsToDisplay=itemsToDisplay;
                }
            }
        }catch (e){
            alert(e);
        }
    }

getBookings();



    let employees=[];
    let nameForDisplaying;
    let phoneForDisplaying;
    let emailForDisplaying;
    let departmentForDisplaying;
    async function getEmployee () {
        console.log('getEmployee called');
        try {
            const resp = await fetch(targetURLUsers+'/'+parseJwt($tokenStore.token)._id, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'authorization': 'Bearer '+$tokenStore.token
                }
            });
            let tempItems = await resp.json();
            for (const tempItem of tempItems) {
                employees.push(tempItem);
                employees=employees;
            }

            nameForDisplaying=employees[0].name;
            phoneForDisplaying=employees[0].phone;
            emailForDisplaying=employees[0].email;
            departmentForDisplaying=employees[0].department;
        }catch (e){
            console.error(e);
        }
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



    let shiftDateForAddingReservation;
    let isMorningShiftForAddingReservation=false;
    async function addReservation() {
        await fetch(targetURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'authorization': 'Bearer ' + $tokenStore.token
            },
            body: JSON.stringify({
                userEmail:parseJwt($tokenStore.token).email,
                shiftDate: shiftDateForAddingReservation,
                isMorningShift: isMorningShiftForAddingReservation
            }),
        })
            .then(async (res) => {
                if (res.ok) {

                    router.redirect('/admin-page');
                    router.redirect('/home');
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


    async function deleteBooking (id) {

        await fetch(targetURL+'/'+id, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'authorization': 'Bearer '+$tokenStore.token
            }
        })
            .then(async (res) => {
                if (res.ok) {
                    router.redirect('/admin-page');
                    router.redirect('/home');
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


</script>

<body id="page-top">
<div id="wrapper">
    <nav class="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg p-0">
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
                    {#if (parseJwt($tokenStore.token).role.includes('employee'))}
                        <li class="nav-item">
                            <a class="nav-link" href="/home">
                                <i class="fas fa-calendar-check"></i>
                                <span>My Reservations</span>
                            </a>
                        </li>

                    {/if}
                    {#if (parseJwt($tokenStore.token).role.includes('admin'))}
                        <li class="nav-item">
                            <a class="nav-link" href="/all-users">
                                <i class="fa fa-bicycle"></i>
                                <span>All Employees</span>
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
                            <a on:click={getMyInfo} class="nav-link oneLine" data-bs-target="#modal-5" data-bs-toggle="modal"  >
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
                        <h4>Here are your reservations!</h4>
                        <h4 class="text-dark" style="margin-bottom: 13px;">Add a reservation here&nbsp;
                            <button
                                    class="btn btn-primary border rounded-circle justify-content-xl-center align-items-xl-center"
                                    id="add-button" type="button" style="border-radius: 0;" data-bs-target="#modal-4"
                                    data-bs-toggle="modal">
                                <i class="fas fa-plus"></i>
                            </button>
                        </h4>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                <tr class="text-center">
                                    <th>shift date</th>
                                    <th>is morning shift</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody class="text-center">

                                {#each itemsToDisplay as item}
                                    {#if item.shiftDate > today}
                                        <tr>
                                            <td>{item.shiftDate}</td>
                                            <td>{item.isMorningShift}</td>
                                            <td>
                                                <button  class="btn btn-primary shadow-sm" type="button"
                                                        data-bs-target="#modal-1" data-bs-toggle="modal">Edit
                                                </button>
                                            </td>
                                            <td>
                                                <button on:click={deleteBooking(item._id)} class="btn btn-primary  btn-danger" type="button"
                                                       >Delete
                                                </button>
                                            </td>
                                        </tr>
                                    {:else }
                                        <tr class="notAvailable">
                                            <td style="color: red">{item.shiftDate} (in the past)</td>
                                            <td>{item.isMorningShift}</td>
                                            <td>
                                                <button  class="btn btn-primary shadow-sm disabled" type="button"
                                                         data-bs-target="#modal-1" data-bs-toggle="modal">Edit
                                                </button>
                                            </td>
                                            <td>
                                                <button  class="btn btn-primary shadow-sm disabled btn-danger" type="button"
                                                         >Delete
                                                </button>
                                            </td>
                                        </tr>
                                    {/if}
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
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>


                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-danger" type="button" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" role="dialog" tabindex="-1" id="modal-2">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header"><h4 class="modal-title"></h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form><input  class="form-control" type="number" name="price" placeholder="Enter the price " required="true">
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="submit" data-bs-dismiss="modal">Save</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" role="dialog" tabindex="-1" id="modal-3">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header"><h4 class="modal-title">Your account info</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <input  class="form-control" type="number" name="price" placeholder="Enter the price " required="true">
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="submit" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" role="dialog" tabindex="-1" id="modal-4" aria-hidden="true" aria-labelledby="modal-4label">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header"><h4 class="modal-title">Add a reservation</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <input min={today} bind:value={shiftDateForAddingReservation} type="date" required>
                    <br>
                    Is morning shift:
                    <input type="checkbox"  name="scales"
                           bind:checked="{isMorningShiftForAddingReservation}">
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-danger" type="button" data-bs-dismiss="modal">Close</button>
                <button on:click={addReservation} class="btn btn-primary" data-bs-dismiss="modal" type="submit">Add Reservation</button>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" role="dialog" tabindex="-1" id="modal-5" aria-hidden="true" aria-labelledby="modal-5label">
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
    .bg{
        background-color: #1cc88a !important;
        background-image: linear-gradient(
                180deg, #dc35b6 10%, #8394c4 100%) !important;
        background-size: cover !important;
    }


</style>