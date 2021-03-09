//MarinDeckのGET機能からアクセスするための鯖。
const express = require('express');
require('http').createServer(express().use(express.static('./'))).listen(3000);