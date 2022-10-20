<script>
    import router from 'page';
    let targetURL = 'http://localhost:3000/users';
    let name,email,password,passwordRepeat = '';

    async function register(){
        if(password == passwordRepeat){
            let userBody=[];
            userBody.name=name;
            userBody.email=email;
            userBody.password=password;

            const response=await fetch(targetURL,{
                method:'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body:JSON.stringify({
                    name:name,
                    email:email,
                    password:password
                })
            }).then(async (res)=>{
                if(res.ok){
                    console.log('Register successfully.');
                    router.redirect('/login');
                    return response.json();
                }else{
                    throw new Error(await res.text());
                }
            }).catch((err)=>{
                alert(err);
            })

        } else {
            alert('The passwords you entered are not the same. Please check...')
        }
    }

</script>

<body class="bg-gradient-primary register">
<div class="container">
    <div class="card shadow-lg o-hidden border-0 my-5">
        <div class="card-body p-0">
            <div class="row">
                <div class="col-lg-5 d-none d-lg-flex">                           <!-- Also this is correct -->
                    <div class="flex-grow-1 bg-register-image" style="background: url('images/register.jpg') center / cover no-repeat;"></div>
                </div>
                <div class="col-lg-7">
                    <div class="p-5">
                        <div class="text-center">
                            <h4 class="text-dark mb-4">Create an Account!</h4>
                        </div>
                        <form class="user">
                            <div class="row mb-3">
                                <div class="col mb-3 mb-sm-0">
                                    <input bind:value={name} class="form-control form-control-user" type="text"
                                           id="exampleFirstName" placeholder="Enter your name"
                                           name="name" required minlength="3">
                                </div>
                            </div>
                            <div class="mb-3">
                                <input bind:value={email} class="form-control form-control-user" type="email"
                                       id="exampleInputEmail" aria-describedby="emailHelp"
                                       placeholder="Enter your Email Address" name="email" required
                                       inputmode="email">
                            </div>
                            <div class="row mb-3">
                                <div class="col-sm-6 mb-3 mb-sm-0">
                                    <input bind:value={password} class="form-control form-control-user"
                                           type="password" id="examplePasswordInput"
                                           placeholder="Enter your Password"
                                           name="password" required>
                                </div>
                                <div class="col-sm-6">
                                    <input bind:value={passwordRepeat} class="form-control form-control-user" type="password"
                                           id="exampleRepeatPasswordInput"
                                           placeholder="Repeat your Password" name="password_repeat" required>
                                </div>
                            </div>
                            <button on:click|preventDefault={register} class="btn btn-primary d-block btn-user w-100" type="submit">Register Account
                            </button>
                        </form>
                        <div class="text-center" style="margin-top: 5px;">
                            <a class="small" href="/login">Already have an account? Login!</a>
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
    .register {
        overflow: auto;
        height: 100vh;
    }
</style>