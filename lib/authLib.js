module.exports = {
    checkLogin:function (request, response){
        if(request.user){
        return true
        } else {
        return false
        }
    },
    makeLoginUI:function (request, response){
        let loginStatusUI = '<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>';
        if (this.checkLogin(request, response)){
        loginStatusUI = `${request.user.displayName} | <a href="/auth/logout">logout</a>`;
        }
        return loginStatusUI
    }
}
