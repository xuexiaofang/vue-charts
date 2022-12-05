<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref">
        
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {getProvinceMapInfo} from '@/utils/map_utils'
export default {
    data(){
        return{
            chartInstance:null,
            allData:null,
            mapData:{}
        }
    },
    mounted(){
        this.initChart()
        window.addEventListener('resize',this.screenApdapter)
        this.screenApdapter()    
    },
    beforeDestroy(){
        window.removeEventListener('resize',this.screenApdapter)
    },
    computed:{

    },
    methods:{
       async initChart(){
           this.chartInstance = new this.$echarts.init(this.$refs.map_ref,'dark')
           const res = await axios.get('http://localhost:8080/static/map/china.json')
           this.$echarts.registerMap('chinaMap',res.data)
           const initOption = {
            title:{
                text:'| 商家分布',
                left:20,
                top:10,
               
            },
            geo:{
                type:'map',
                map:'chinaMap',
                roam:true,// 设置允许缩放以及拖动的效果
                label:{
                show:true //展示省的名称
                },
                top:40,
                itemStyle:{
                    areaColor:'#2E72BF',
                    borderColor:'#333'
                }
           },
           legend:{
                bottom:'5%',
                left:'5%',
                orient:'vertival', //图例的摆放方向
               
           }
        }
           this.chartInstance.setOption(initOption)
           //点击某个省份触发的事件
           this.chartInstance.on('click',async(arg)=>{
            let mapPath = getProvinceMapInfo(arg.name)  
            let resJson;
            //如果被点击过了某个省份，再次点击就走缓存里的数据，如果缓存里有数据，就从缓存里取，没有就走axios请求
            if(!this.mapData[mapPath.key]) {
                const res = await axios.get(`http://localhost:8080${mapPath.path}`)
                resJson = res.data
                this.mapData[mapPath.key] = resJson
                this.$echarts.registerMap(mapPath.key,resJson)
                // console.log('缓存里没有数据');
            } 
            // else{
            //     //如果有就从缓存里取
            //      resJson = this.mapData[mapPath.key]
            //     console.log('缓存里有数据');
                
            // } 
           
           
            let mapOption = {
                geo:{
                    map:mapPath.key
                }
            }
            this.chartInstance.setOption(mapOption)
            
        })
           this.getData()
        },
         async getData(){
          const {data:res} = await this.$API.reqChina()
          this.allData = res
           this.updateChart()
        },
        updateChart (){
            let seriesArr = this.allData.map((item)=>{
                return {
                    name:item.name,
                    type:'effectScatter',
                    data:item.children,
                    coordinateSystem:'geo',
                    rippleEffect:{
                        scale:5,
                        brushType:'stroke'//空心效果的涟漪动画
                    }
                }
            })
            const dataOption = {
                series:seriesArr
            }        
            this.chartInstance.setOption(dataOption)
        },
        screenApdapter(){
            const font = this.$refs.map_ref.offsetWidth/50
          const adapterOption = {
            title:{
                textStyle:{
                    fontSize:font
                }
            },
            legend:{
                itemWidth:font/1.5,
                itemHeight:font/1.5,
                textStyle:{
                    fontSize:font/1.5
                },
                itemGap:font/1.5
            }

          }
          this.chartInstance.setOption(adapterOption)
          this.chartInstance.resize()
        },
        //双击返回中国地图函数
        revertMap(){
            const geoOption = {
                geo:{
                    map:'chinaMap'
                }
            }
            this.chartInstance.setOption(geoOption)
        }
    }

}
</script>

<style>

</style>