<template>
  <div class="com-container">
      <div class="title" :style="fonts">
        <span>| {{showTitle}}</span><span class="iconfont icon-xiangxiajiantou jiantou" @click="showselect = !showselect" :style="fonts"></span>
        <div v-show="showselect" class="selectItem" v-for="(item,index) in selectTypes" :key="index" @click="tabTypes(item.key)">
         {{item.text}}
        </div>
      </div>
     <div class="com-chart" ref="trend_ref" >11</div>
  </div>
</template>

<script>
export default {
    name:'MyTrend',
    data(){
      return{
        chartInstance:null,
        allData:null,
        showselect:false,
        fontsize:null,
        choiceType:'map',
        font:0
        
      }
    },
    computed:{
      selectTypes(){
        if(!this.allData){
          return []
        }else{
          //把标题数组中的存在大标题的标题给去掉,大标题showTitle是什么，就把type里的某一项去掉，过滤数组后返回
         return  this.allData.type.filter((item)=>item.text!=this.showTitle)
          // return this.allData.type
        }
        
      },
      showTitle(){
        // const choiceType = this.choiceType
        if(!this.allData){
          return ''
        }else{
            return this.allData[this.choiceType].title
        }
      },
      fonts(){
        if(!this.font){
          return {
            fontSize:'16px'
          }
        }
        return {
          fontSize:this.font+'px'
      }
    }
    },
    mounted(){
      this.initChart(),
      // 监听图表外框缩放事件，在销毁前取消监听
      window.addEventListener('resize',this.screenApdapter)
    //  加载后就监听
      this.screenApdapter()
    },
    beforeDestroy(){
      window.removeEventListener('resize',this.screenApdapter)
    },
    methods:{
      // 1。初始化echarts对象
      initChart(){
        this.chartInstance = this.$echarts.init(this.$refs.trend_ref,'dark')//dark主题，在index.html中引入dark主题
      //  initOption舒适化配置，option会整合
        const initOption = {
          legend:{
            top:'25%',
            left:30,
            icon:'circle'//图例图标的形状
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          grid: {
            top:'33%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          }, 
          xAxis: [
              {
                type: 'category',
                boundaryGap: false,
              }
            ],
            yAxis: [
              {
                type: 'value',
                splitLine:{
                      show:false
                    }
              }
            ]
        }
        this.chartInstance.setOption(initOption)
        this.getData()
      },
      //2. 获取后台数据存起来
     async getData(){
       const res = await this.$API.reqTrend()
       this.allData = res.data
      //  获取后台数据配置option
      this.updateChart()
      },
      // 3.更新图表配置option
      updateChart(){
        const xAxisData = this.allData.common.month
        let choice = this.choiceType
        const mapData= this.allData[choice].data
      //  const {title} = this.allData.map
       const colorArr1 = ['rgba(11,168,44,5)','rgba(44,110,255,.5)','rgba(22,242,217,.5)','rgba(254,33,30,.5)','rgba(250,105,0,.5)']
      const colorArr2 = ['rgba(11,168,44,0)','rgba(44,110,255,0)','rgba(22,242,217,0)','rgba(254,33,30,0)','rgba(250,105,0,0)']
       const seriesArr = mapData.map((item,index)=>{
        return {
          type:'line',
          data:item.data,
          stack:'map',
          name:item.name,
          smooth:true,
          showSymbol:false,
          
          itemStyle:{
          borderColor:'rgba(255,255,255,.1)',
          borderWidth:12
        },
          areaStyle:{
            color:new this.$echarts.graphic.LinearGradient(0,0,0,1,[{
              offset:0,
              color:colorArr1[index]
            },
          {
            offset:.8,
            color:colorArr2[index]
          }])
          }
        }
       })
        const dataOption = {
            color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
            // title: {
            //   text: title,
            // },
            xAxis: [
              {
                data: xAxisData,
              }
            ], 
            series:seriesArr
          };
        this.chartInstance.setOption(dataOption)
      },
      // 4.分辨率适配，例如：文字大小
      screenApdapter(){
      this.font = this.$refs.trend_ref.offsetWidth/50
        const adapterOption ={
          legend:{
            itemWidth:this.font/1.5,
            itemHeight:this.font/1.5,
              textStyle:{
                fontsize:this.font
              }
          }
        }
        this.chartInstance.setOption(adapterOption)


        this.chartInstance.resize()
      },
      //切换显示图表
      tabTypes(type){
        this.choiceType = type
        this.updateChart()
        this.showselect = false
      }
    }
}
</script>

<style lang="less">
  .title{
    position: absolute;
    top:20px;
    left:30px;
    color:#fff;
    z-index:5;
    font-size: 16px;
    .selectItem{
      cursor: pointer;
      background: rgba(34, 39, 51,.3);
    }
    .jiantou{
      padding-left: 10px;
      cursor: pointer;
    }
  }
</style>