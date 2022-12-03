import Mock from "mockjs";
import seller from './seller.json';
import trend from './trend.json'
Mock.mock("/mock/seller",{code:200,data:seller});
Mock.mock('/mock/trend',{code:200,data:trend})