const mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Hash password
userSchema.pre('save', function(next){
    if(this.isModified('password') || this.isNew){
        bcrypt.hash(this.password, 10, (err, hashedPassword) => {
            if(err)
                next(err);
            else{
                this.password = hashedPassword;
                next();
            }
        });
    }
});


// Compare password
userSchema.methods.isCorrectPassword = function(password, callback){
    let p = this.password;
    bcrypt.compare(password, p, function(err, same){
        if(err){
            callback(err);
        } else{
            callback(err, same)
        }
    })
}

module.exports = mongoose.model('User', userSchema);


