var mocker = require('mocker-data-generator').default;
const fs = require('fs');
const path = require('path');

var user = {
    first_name: {
        faker: 'name.firstName'
    },
    last_name: {
        faker: 'name.lastName'
    },
    email: {
        function: function () {
            return (
                this.object.first_name.toLowerCase() + '.' +
                this.object.last_name.toLowerCase() + '@gmail.com'
            )
        }
    },
    gender: {
        function: function () {
            const r = Math.floor(Math.random()*2);
            return ['male', 'famale'][r];
        }
    },
    address: {
        function: function () {
            return [
                this.faker.address.zipCode(),
                this.faker.address.country() + ',',
                this.faker.address.city() + ',',
                this.faker.address.streetAddress()
            ].join(' ');
            /* const street = this.faker.address.streetAddress;
            return Object.keys(this.faker).join(','); */
        }   
    }
}

const mockIt = async (rows) => {
    const data = await mocker()
    .schema('user', user, rows)
    .build();

    return data;
};

mockIt(10000).then( data => {
    for (let k in data.user) {
        data.user[k].id = (parseInt(k) + 1);
    }

    const filePath = path.join(__dirname, 'db.json');
    const mockData = { users: data.user };
    fs.writeFile(filePath, JSON.stringify(mockData, null, 4), 'utf8', (err) => {
        if (err)  {
            return console.error(err);
        }
        console.log(`Written: ${filePath}`);
    });
} );
