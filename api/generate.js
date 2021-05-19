const _ = require('lodash');
const faker = require('faker');
const fs = require('fs');

const commentCount = 1233;
const postCount = 328;
const userCount = 57;

async function generateData() {
  const users = _.times(userCount, (index) => {
    const gender = _.random(0, 1);
    const firstName = faker.name.firstName(gender);
    const lastName = faker.name.lastName(gender);

    return {
      id: index + 1,
      firstName,
      lastName,
      emailAddress: faker.internet.email(firstName, lastName),
      username: faker.internet.userName(firstName, lastName),
      password: faker.internet.password(undefined, true),
      avatar: faker.internet.avatar(),
      registerUtc: faker.date
        .between(new Date(2010, 1, 1), new Date())
        .toISOString(),
    };
  });

  users.push({
    id: userCount + 1,
    username: 'jsalyer',
    password: 'jimbo',
    firstName: 'Jim',
    lastName: 'Salyer',
    emailAddress: 'jim.salyer@wwt.com',
    avatar: '',
    registerUtc: new Date(2010, 1, 1).toISOString(),
  });

  const posts = _.times(postCount, (index) => {
    const bodyParagraphCount = faker.datatype.number({ min: 4, max: 16 });
    const user = faker.random.arrayElement(users);
    const createUtc = faker.date.between(user.registerUtc, new Date());

    return {
      id: index + 1,
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(bodyParagraphCount),
      excerpt: faker.lorem.paragraph(),
      image: faker.image.technics(1200, 750),
      userId: user.id,
      createUtc,
      modifyUtc: faker.date.between(createUtc, new Date()),
    };
  });

  const comments = _.times(commentCount, (index) => {
    const post = faker.random.arrayElement(posts);
    const bodyParagraphCount = faker.datatype.number({ min: 1, max: 3 });
    const user = faker.random.arrayElement(users);
    const createUtcMin =
      post.createUtc > user.registerUtc ? post.createUtc : user.registerUtc;
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

  const data = { users, posts, comments, accessTokens: [] };
  const dataString = JSON.stringify(data, null, 2);
  const dataBuffer = Buffer.from(dataString);
  fs.writeFileSync('db.json', dataBuffer);
}

generateData();
