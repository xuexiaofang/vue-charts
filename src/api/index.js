import mockRequest from './mockRequest'
export const reqEchartData = () => mockRequest.get("/seller")
export const reqTrend = ()=>mockRequest.get('/trend')
export const reqChina  = ()=>mockRequest.get('/china')
