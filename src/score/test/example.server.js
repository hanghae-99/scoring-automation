const express = require('express');
const [app, app2, app3, app4] = [express(), express(), express(), express()];
const mongoose = require('mongoose');

async function enableTestServers() {
  await mongoose.connect('mongodb://localhost:27017/test');
  const User = mongoose.model(
    'User',
    {
      id: String,
      name: String,
      email: String,
      pw: String,
    },
    'users',
    {
      _id: false,
    },
  );

  await User.deleteMany({});

  await User.insertMany([
    { id: 1, name: '김철수', email: 'chulsoo@test.com', pw: '1234' },
    { id: 2, name: '김영희', email: 'young_hee@test.com', pw: '4321' },
    { id: 3, name: '홍길동', email: 'best_gd@test.com', pw: '1111' },
  ]);
  /**
   * @server_1 정상 응답 시나리오
   */
  app.get('/member', async (req, res) => {
    const users = await User.find({}).lean();
    res.status(200).json(users);
  });

  app.get('/member/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ id }).lean();

    if (!user) {
      return res.status(400).json({ message: 'user not found' });
    }

    res.status(200).json(user);
  });

  app.listen(3000, () => {
    console.log('example server_1 running');
  });

  /**
   * @server_2 부족한 길이의 유저 배열과 잘못된 응답코드
   */
  app2.get('/member', async (req, res) => {
    res.status(202).json(await User.find({}, {}, { limit: 2 }).lean());
  });

  app2.get('/member/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ id }).lean();

    if (!user) {
      return res.status(400).json({ message: 'user not found' });
    }

    res.status(200).json(user);
  });

  app2.listen(3001, () => {
    console.log('example server_2 running');
  });

  /**
   * @server_3 부족한 요소가 발견되는 전체 조회와 개인 조회
   */
  app3.get('/member', async (req, res) => {
    const users = await User.find({}).lean();
    delete users[0]['email'];
    delete users[0]['pw'];

    res.status(200).json(users);
  });

  app3.get('/member/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ id }).lean();
    if (user) {
      delete user['email'];
      delete user['pw'];
    }

    if (!user) {
      return res.status(400).json({ message: 'user not found' });
    }

    res.status(200).json(user);
  });

  app3.listen(3002, () => {
    console.log('example server_3 running');
  });

  /**
   * @server_4 가능한 모든 잘못을 저지르는 서버
   */
  app4.get('/member', async (req, res) => {
    const users = await User.find({}, {}, { limit: 2 }).lean();
    delete users[0]['email'];
    delete users[0]['pw'];
    res.status(201).json(users);
  });

  app4.get('/member/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ id }).lean();

    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    // status 204일경우 no-content이므로 json을 보낼 수 없다. 응답은 무조건 빈 문자열로 고정된다.
    res.status(202).json({});
  });

  app4.listen(3003, () => {
    console.log('example server_4 running');
  });
}

enableTestServers();
