<script>
    import tokenStore from '../stores/token';
    import { LightPaginationNav, paginate } from 'svelte-paginate';
    import router from 'page';
    import { fade, fly } from 'svelte/transition';




    let targetURL = 'http://localhost:3000/bookings';

    let items = [];
    let postNewEmail,postNewDate='',postNewIsMorningShift=false;
    let editEmail,editDate='', editIsMorningShift=false;
    //To convert the date to dd-mm-yyyy form
    let today = new Date().toISOString().split("T")[0];

    //For pagination
    let currentPage = 1;
    let pageSize = 7;
    $: paginatedItems = paginate({ items, pageSize, currentPage });


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
        }catch (e){
            alert(e);
        }
    }


    async function editBooking (id) {

        console.log('edit booking, date:',editDate);

        await fetch(targetURL+'/'+id, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json',
                'authorization': 'Bearer '+$tokenStore.token
            },
            body: JSON.stringify({

                userEmail:editEmail,
                shiftDate:editDate,
                isMorningShift:editIsMorningShift
            })
        }).then(async (res) => {
            if (res.ok) {

                router.redirect('/home');
                router.redirect('/admin-page');
                console.log("Success!");
            } else {
                res.json().then((body) => {
                    alert(body.message || "Internal error");
                });
            }
        }).catch(async (err) => {
            alert(err);
        });
    }

    /**
     * DELETE request
     * @param bikeId to be deleted
     * @returns {Promise<void>} that deletes the bike from the back-end with a given id
     */
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
                    router.redirect('/home');
                    router.redirect('/admin-page');
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



    let bookingIdForEditing;
    async function getId(id) {
        bookingIdForEditing = id;
        console.log('booking id for editing'+bookingIdForEditing);
        await fillBookingInfoIntoForm();

    }



    async function fillBookingInfoIntoForm(){

        const Resp = await fetch(targetURL+'/'+bookingIdForEditing,{
            headers: {
                'Content-type': 'application/json',
                'authorization': 'Bearer '+$tokenStore.token
            }
        });
        let resJson = await Resp.json();
        console.log(resJson);

         editEmail= resJson[0].userEmail;
         console.log("editEmail: "+editEmail);
         editDate=resJson[0].shiftDate;
         console.log("edit date"+editDate);
         editIsMorningShift=resJson[0].isMorningShift;


    }

    getBookings();

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



    function closeCollapse() {
        this.parentElement.parentElement.parentElement.parentElement.classList.remove('show');
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
        <div class="container-fluid d-flex flex-column p-0"><a
                class="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href=""
                style="padding-top: 36px;">
            <div class="sidebar-brand-icon rotate-n-15"><i class="far fa-calendar-alt"></i></div>
            <div class="sidebar-brand-text mx-3"><span style="font-size: 25px;">Planion<br></span><span
                    class="text-capitalize" style="font-size: 12px;font-family: 'Bad Script', serif;">Start planning today!<br>&nbsp;</span>
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
                    <button class="btn btn-link d-md-none rounded-circle me-3" id="sidebarToggleTop" type="button"><i
                            class="fas fa-bars"></i></button>

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
                <div>
                    <h3 class="text-dark">Welcome
                        {#if $tokenStore.token != ''}
                            {parseJwt($tokenStore.token).name}
                        {/if}
                    </h3>
                    <h4 class="text-dark" style="margin: -1px -1px 5px;">
                        Here you can
                        add, remove or modify reservations
                    </h4>

                </div>
                <div class="row">
                    <div class="col">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                <tr class="text-center">
                                    <th>employee email</th>
                                    <th>shift date</th>
                                    <th>morning shift</th>

                                    <th></th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody class="text-center">
                                {#each paginatedItems as item}

                                    <tr >
                                        <td>{item.userEmail}</td>
                                        {#if item.shiftDate>today}
                                            <td>{item.shiftDate}</td>
                                        {:else}
                                            <td style="color: red">{item.shiftDate} (in the past)</td>
                                        {/if}

                                        <td>{item.isMorningShift}</td>
                                        {#if item.shiftDate>today}
                                            <td>
                                                <button on:click={deleteBooking(item._id)} class="btn btn-danger" type="button">Delete</button>
                                            </td>
                                            <td>
                                                <button on:click={getId(item._id)} class="btn btn-primary" type="button" data-bs-toggle="collapse"
                                                         data-bs-target="#form">Modify
                                                </button>
                                            </td>
                                        {:else}
                                            <td>
                                                <button  class="btn btn-danger disabled" type="button">Delete</button>
                                            </td>
                                            <td>
                                                <button  class="btn btn-primary disabled" type="button" data-bs-toggle="collapse"
                                                         data-bs-target="#form">Modify
                                                </button>
                                            </td>
                                        {/if}

                                    </tr>
                                {:else}
                                    {#if items.length > 0}
                                        <span class="spinner-border mt-2" role="status"></span>
                                    {:else }
                                        <p in:fade={{delay:600}}>No reservation to show!</p>
                                    {/if}

                                {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div  class="row collapse" id="form">
                    <div class="col">
                        <form>
                            <input bind:value={editEmail} class="form-control oneLine disabled" type="text" name="brand"
                                      style="width: 60%;margin-bottom: 10px;"
                                     required>


                            <input min={today} bind:value={editDate} class="form-control oneLine"  type="date" name="date" required>

                                Is morning shift:
                                <input type="checkbox"  name="scales"
                                       bind:checked="{editIsMorningShift}">


                            <div class="mb-4">
                                <button on:click={editBooking(bookingIdForEditing)} class="btn btn-primary" type="button">Submit</button>
                                <button class="btn btn-warning text-light" type="button" on:click={closeCollapse}><strong>Close</strong></button>
                            </div>
                        </form>
                    </div>
                </div>

                {#if items.length > 0}
                    <LightPaginationNav
                            totalItems="{items.length}"
                            pageSize="{pageSize}"
                            currentPage="{currentPage}"
                            limit="{1}"
                            showStepOptions="{true}"
                            on:setPage="{(e) => currentPage = e.detail.page}"
                    />
                {/if}

            </div>
        </div>

        <footer class="bg-white d-xl-flex justify-content-xl-center align-items-xl-end sticky-footer mt-3">
            <div class="container my-auto">
                <div class="text-center my-auto copyright"><span>Copyright © Planion 2021</span></div>
            </div>
        </footer>

    </div>
    <a class="border rounded d-inline scroll-to-top" href="#page-top"><i class="fas fa-angle-up"></i></a></div>


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

</style>