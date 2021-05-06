const _ = require('lodash');
const axios = require('axios');
const faker = require('faker');
const fs = require('fs');

const commentCount = 1233;
const postCount = 328;
const userCount = 57;

async function generateData() {
  console.log('Generating users...');
  const response = await axios.get(
    `https://randomuser.me/api/?results=${userCount}`
  );

  if (response.data && response.data.results && response.data.results.length) {
    const users = response.data.results.map((result, index) => ({
      id: index + 1,
      username: result.login.username,
      password: result.login.password,
      firstName: result.name.first,
      lastName: result.name.last,
      emailAddress: result.email,
      avatar: result.picture.large,
      registerUtc: result.registered.date,
    }));

    users.push({
      id: users.length + 1,
      username: 'jsalyer',
      password: 'jimbo',
      firstName: 'Jim',
      lastName: 'Salyer',
      emailAddress: 'jim.salyer@gmail.com',
      avatar: 'https://randomuser.me/api/portraits/lego/3.jpg',
      registerUtc: new Date().toISOString(),
    });

    console.log('Generating posts...');
    const posts = _.times(postCount, (index) => {
      const bodyParagraphCount = faker.datatype.number({ min: 4, max: 16 });
      const user = faker.random.arrayElement(users);
      const createUtc = faker.date.between(user.registerUtc, new Date());
      const publishUtc = faker.date.between(createUtc, new Date());

      return {
        id: index + 1,
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(bodyParagraphCount),
        excerpt: faker.lorem.paragraph(),
        image: faker.image.technics(1200, 750),
        userId: user.id,
        createUtc,
        publishUtc,
        modifyUtc: faker.date.between(publishUtc, new Date()),
      };
    });

    console.log('Generating comments...');
    const comments = _.times(commentCount, (index) => {
      const post = faker.random.arrayElement(posts);
      const bodyParagraphCount = faker.datatype.number({ min: 1, max: 3 });
      const user = faker.random.arrayElement(users);
      const createUtcMin =
        post.publishUtc > user.registerUtc ? post.publishUtc : user.registerUtc;
      const createUtc = faker.date.between(createUtcMin, new Date());

      return {
        id: index + 1,
        postId: post.id,
        body: faker.lorem.paragraphs(bodyParagraphCount),
        userId: user.id,
        createUtc,
        modifyUtc: faker.date.between(createUtc, new Date()),
      };
    });

    console.log('Saving data to file...');
    const data = { users, posts, comments };
    const dataString = JSON.stringify(data, null, 2);
    const dataBuffer = Buffer.from(dataString);
    fs.writeFileSync('db.json', dataBuffer);
  }
}

generateData();
