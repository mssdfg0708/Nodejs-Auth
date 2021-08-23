module.exports = {
    checkLogin:function (request, response){
        if(request.session.isLogin){
        return true
        } else {
        return false
        }
    },
    makeLoginUI:function (request, response){
        let loginStatusUI = '<a href="/auth/login">login</a>';
        if (this.checkLogin(request, response)){
        loginStatusUI = `${request.session.nickname} | <a href="/auth/logout">logout</a>`;
        }
        return loginStatusUI
    }
}
