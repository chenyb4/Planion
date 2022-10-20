<script>
    import tokenStore from '../stores/token';
    let email,password = '';
    let targetURL = 'http://localhost:3000/credentials';
    import router from 'page';
    let user = [];


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


    async function login () {
        await fetch(targetURL, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
            }).then(async (res) => {
            if (res.ok) {
                $tokenStore = await res.json();
                console.log('Login successfully');
                if ((parseJwt($tokenStore.token).role.includes('admin'))){
                    router.redirect('/admin-page');
                } else {
                    router.redirect('/home');
                }

            } else {
                throw new Error(await res.text());
            }
        }).catch((err)=>{
           alert(err);
        })
    }
</script>

<body class="bg-gradient-primary login">
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-9 col-lg-12 col-xl-10">
            <div class="card shadow-lg o-hidden border-0 my-5">
                <div class="card-body p-0">
                    <div class="row">
                        <div class="col-lg-6 d-none d-lg-flex">              <!-- This is correct dont mind the red line -->
                            <div class="flex-grow-1 bg-login-image" style="background: url('images/login.jpg') center / cover no-repeat;"></div>
                        </div>
                        <div class="col-lg-6">
                            <div class="p-5">
                                <div class="text-center">
                                    <h4 class="text-dark mb-4">Welcome Back!&nbsp;<svg
                                            xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                                            viewBox="0 0 24 24" fill="none">
                                        <path d="M15.4857 20H19.4857C20.5903 20 21.4857 19.1046 21.4857 18V6C21.4857 4.89543 20.5903 4 19.4857 4H15.4857V6H19.4857V18H15.4857V20Z"
                                              fill="currentColor"></path>
                                        <path d="M10.1582 17.385L8.73801 15.9768L12.6572 12.0242L3.51428 12.0242C2.96199 12.0242 2.51428 11.5765 2.51428 11.0242C2.51429 10.4719 2.962 10.0242 3.51429 10.0242L12.6765 10.0242L8.69599 6.0774L10.1042 4.6572L16.4951 10.9941L10.1582 17.385Z"
                                              fill="currentColor"></path>
                                    </svg>
                                    </h4>
                                </div>
                                <form class="user">
                                    <div class="mb-3">
                                        <input bind:value={email} class="form-control form-control-user" type="email"
                                               id="exampleInputEmail" aria-describedby="emailHelp"
                                               placeholder="Enter Email Address" name="email"
                                               autocomplete="on" inputmode="email" required >
                                    </div>
                                    <div class="mb-3">
                                        <input bind:value={password} class="form-control form-control-user" type="password"
                                               id="exampleInputPassword" placeholder="Password"
                                               name="password" required>
                                    </div>
                                    <button class="btn btn-primary d-block btn-user w-100" type="submit" on:click|preventDefault={login}>Login</button>
                                </form>
                                <div class="text-center" style="margin-top: 5px;">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
<script defer src="assets/js/script.min.js"></script>
</body>

<style>
    .login {
        overflow: auto;
        height: 100vh;
    }
</style>