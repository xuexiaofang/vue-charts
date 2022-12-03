<template>
  <div class="com-container">
    当前页{{currentPage}}总页数{{totalPage}}
     <div class="com-chart" ref="seller_ref" ></div>
  </div>
</template>

<script>
export default {
    name:'MySeller',
    data(){
      return{
        chartInstance:null,
        optionData:[],
        currentPage:1,
        totalPage:0,
        intervalTime:null
      }
    },
    mounted(){
      this.initChart()
      // this.getData()
      //文字大小适配屏幕大小方法
      this. screenUpdata()
    },
    beforeDestroy(){
      clearInterval(this.intervalTime) 
      //销毁监听事件 
      window.removeEventListener('resize',this.screenUpdata)

    },
    computed:{
      
    },
    watch:{
    },
    methods:{
      //初始化对象
      initChart(){
       this.chartInstance = this.$echarts.init(this.$refs.seller_ref,'dark')
       this.chartInstance.on('mouseover',()=>{
        clearInterval(this.intervalTime)
       })
       this.chartInstance.on('mouseout',()=>{
        this.startInterval()
       })
       const option = {
          title:{
            text:'| 商家销售量统计',
            textStyle:{
              fontSize:60
            },
            left:40,
            top:40
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              z:0,
              type: 'line',//形状为线
              lineStyle:{
                width:66,
                color:'#2D3433'
              }
            }
          },
        
          grid: {
            top:'20%',
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
           
          },
          series: [
            {
              name: '2012',
              type: 'bar',
             
              barWidth:66,
              label:{
                show:true,
                position:'right',
               
              },
              itemStyle:{
                
                barBorderRadius:[0,33,33,0],
                //指明颜色渐变的方向
                //指明不同百分比之下的颜色值
                color:new this.$echarts.graphic.LinearGradient(0,0,1,0,[{
                  offset:0,
                  color:'#5052EE'
                },
            {
              offset:1,
              color:'#AB6EE5'
            }])
              }
            }
          ]
        };
       this.chartInstance.setOption(option)
       this.getData()
      },
      //获取数据
     async getData(){
        const res =  await this.$API.reqEchartData()
       if(res.code===200){
        this.optionData = res.data
        this.optionData.sort((a,b)=>a.value-b.value)
        this.totalPage = Math.ceil(res.data.length/3) 
        this.updateChart()
        this.startInterval(this.intervalTime)
       }
      },
      //更新图表设置
      updateChart(){
        let showData =[]
          showData  = this.optionData.slice((this.currentPage-1)*3,this.currentPage*3)
        const sellerNames = showData.map((item)=>item.name)
        const sellerValues = showData.map((item)=>item.value)
        const optionData = {
   
          yAxis: {
           
            data: sellerNames
          },
          series: [
            {
              data: sellerValues,
            }
          ]
        };
        this.chartInstance.setOption(optionData)
        window.addEventListener('resize',this.screenUpdata)
      },
      //开启定时器
      startInterval(){
        if(this.intervalTime){
          clearInterval(this.intervalTime)
        }
       this.intervalTime = setInterval(()=>{
        if(this.currentPage>=this.totalPage){
          this.currentPage = 1
        }else{
          this.currentPage++
        }
        this.updateChart()
      },3000)
      },
      //监听页面大小
      screenUpdata(){
        let fontSizeDemo = this.$refs.seller_ref.offsetWidth/26
        let adapterOption =  {
          title:{
            textStyle:{
              fontSize:fontSizeDemo
            },
          
          },
          tooltip: {
            axisPointer: {
              lineStyle:{
                width:fontSizeDemo,
              }
            }
          },
          series: [
            {
              barWidth:fontSizeDemo,
              itemStyle:{
                barBorderRadius:[0,fontSizeDemo/2,fontSizeDemo/2,0],
              }
            }
          ]
        };
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      }
    }
}
</script>

<style>

</style>