const mongoose = require('mongoose');
if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://woyetajudeen:${password}@phone-cluster.fc9rltf.mongodb.net/?retryWrites=true&w=majority&appName=Phone-Cluster`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length === 5) {
    const name = process.argv[3];
    const number = process.argv[4];

    const person = new Person({
        name,
        number,
    });

    person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
} else {
    console.log('Please provide the correct arguments: node.js <password> <name> <number> ');
    process.exit(1);
}