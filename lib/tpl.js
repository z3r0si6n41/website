var fs = require('fs');

class Tpl {
    constructor(hb){
        this.hb = hb;
		this.fileCache = {};
    }

    render(file, cb){
		fs.readFile('/var/www/zero/views/partials/'+file+'.html', 'utf8', (err, data) => {
			if(err){
				throw err;
				return;
			}
			return cb(data);
		});
    }

    build(data){
        var template = this.hb.compile(data.html);
        return template(data.data);
    }

    format(str, args){
        return str.replace(/\{\{|\}\}|\{(\d+)\}/g, function(m, n){
            if(m == "{{") return "{";
            if(m == "}}") return "}";
            return args[n];
        });
    }
}

module.exports = new Tpl();