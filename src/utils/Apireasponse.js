class Apireasponse{
    constructor(statusCode, message="success", data){
        this.status = statusCode;
        this.message = message;
        this.data = null;
        this.success = statusCode >= 200 && statusCode < 300 ? true : false;
    }
}
export { Apireasponse }