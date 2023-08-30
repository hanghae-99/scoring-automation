const express = require('express');
const [app, app2, app3, app4] = [express(), express(), express(), express()];

async function enableTestServers() {
  const db = [
    { id: 1, name: '김철수', email: 'chulsoo@test.com', pw: '1234' },
    { id: 2, name: '김영희', email: 'young_hee@test.com', pw: '4321' },
    { id: 3, name: '홍길동', email: 'best_gd@test.com', pw: '1111' },
  ];
  /**
   * @server_1 정상 응답 시나리오
   */
  app.get('/user', (req, res) => {
    const users = db;
    res
      .status(200)
      .json(users.map(({ id, ...rest }) => ({ userId: id, ...rest })));
  });

  app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    const user = db.find((user) => user.id === +id);

    if (!user) {
      return res.status(400).json({ message: 'user not found' });
    }

    res.status(200).json({ userId: user.id, ...user });
  });

  app.listen(3000, () => {
    console.log('example server_1 running');
  });

  /**
   * @server_2 부족한 길이의 유저 배열과 잘못된 응답코드
   */
  app2.get('/user', async (req, res) => {
    res
      .status(202)
      .json(db.slice(0, 2).map(({ id, ...rest }) => ({ userId: id, ...rest })));
  });

  app2.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    const user = db.find((user) => user.id === +id);

    res.status(200).json({ userId: user.id, ...user });
  });

  app2.listen(3001, () => {
    console.log('example server_2 running');
  });

  /**
   * @server_3 부족한 요소가 발견되는 전체 조회(부족한 요소를 감점하지 않음)와 개인 조회(부족한 요소 감점)
   */
  app3.get('/user', async (req, res) => {
    const users = db.slice();
    users[0].email = undefined;
    users[1].pw = undefined;

    res
      .status(200)
      .json(users.map(({ id, ...rest }) => ({ userId: id, ...rest })));
  });

  app3.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    const user = db.find((user) => user.id === +id);
    if (user) {
      user.email = undefined;
      user.pw = undefined;
    }

    res.status(200).json({ userId: user.id, ...user });
  });

  app3.listen(3002, () => {
    console.log('example server_3 running');
  });

  /**
   * @server_4 가능한 모든 잘못을 저지르는 서버
   */
  app4.get('/user', async (req, res) => {
    const users = [];

    res.status(201).json(users);
  });

  app4.get('/user/:id', async (req, res) => {
    const user = {};

    // status 204일경우 no-content이므로 json을 보낼 수 없다. 응답은 무조건 빈 문자열로 고정된다.
    res.status(202).json(user);
  });

  app4.listen(3003, () => {
    console.log('example server_4 running');
  });
}

enableTestServers();
