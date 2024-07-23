const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  });


  const phoneValidator = {
    validator: function(v) {
      return /^\d{2,3}-\d+$/.test(v) && v.length >= 8;
    },
    message: props => `${props.value} is not a valid phone number! It should be of the It should be of the form XX-XXXXXXX or XXX-XXXXXXXX`
  };



const personSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      required: true
    },
    number: {
      type: String,
      minlength: 8,
      validate: phoneValidator,
      required: true
    }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;