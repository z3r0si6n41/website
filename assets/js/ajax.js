class Ajax {
    xhr = {};
    target = 'https://z3r0sign41.com/';
    params = '';
    
    constructor(target, params, callback){
     this.target = this.target+target;
     
     if(typeof params === 'object' && params !== null){
      this.params = this.serialize(params);
     }else{
      this.params = params;
     }
     if(this.target.includes("/api/")){
      this.params += '&token='+window.localStorage.token;
     }
     this.send(callback);
    }
    
    serialize(obj){
     var str = [];
     for(var p in obj){
      if(obj.hasOwnProperty(p)){
       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
     }
     return str.join("&");
    }
    
    send(callback){
     this.xhr = $.post(this.target, this.params);
     this.xhr.fail(function(e){
      console.log(JSON.stringify(e));
     }).done(function(data){
      callback(data);
     });
    }
   }