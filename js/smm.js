var graphs = {};
var graphsinfo = {};
var pointsets = {};
var fitlines = {};
var thetas = {};
var fitgraphspars = {};
var clustercs = {}; //clusterc = {'averagecc':0.0, 'globalcc':0.0, 'nodes':{}};
var centralitys = {};
var orderdegrees = {};
var aplds = {}
//var graphtmp = {}
var EgraphId;

var Egraph = new Array()
Egraph["nodes"]=new Array()
Egraph["edges"]=new Array()
Egraph["directed"]=1

var rooturl = "http://localhost/smm2/";
var accessurl = rooturl + "access.php";


function ClearGraphCont(){
	var div = document.getElementById("GraphCont");
    while(div.hasChildNodes())
    {
        div.removeChild(div.firstChild);
    }
/*
	if(document.getElementById('Echart')){
		var echa = document.getElementById('Echart');
		echa.parentNode.removeChild(echa);
	}else if(document.getElementById("svgGraph")){
		var svgG = document.getElementById("svgGraph");
		svgG.parentNode.removeChild(svgG);
	}
*/
}

function BuildEchartView(){
	var echa = document.getElementById("GraphCont");
	var element = document.createElement("div");
	element.id = "Echart";
	element.style = "height:500px";// width:800px";
	echa.appendChild(element);
}

require.config({
	paths: {
		echarts: './js/dist'
	}
});

function ShowDegreeDisChart(points){
	ClearGraphCont();
	BuildEchartView();

	require(
		[
			'echarts',
			'echarts/chart/scatter'
		],
		function(ec){
			var myChart = ec.init(document.getElementById('Echart'));
			var option = {
				toolbox: {
       				show : true,
        			feature : {
            			mark : {show: true},
						dataZoom : {show: true},
            			dataView : {show: true, readOnly: false},
           				restore : {show: true},
            			saveAsImage : {show: true}
        			}
    			},
				title:{
					text:'度分布图'
				},
				xAxis: [{
					type : 'value',
					scale : true,
				}],
				yAxis: [{
					type : 'value',
					scale : true,
				}],
				series: [{
					type: 'line',
					data:points
				}]
			}
			myChart.setOption(option);
		}
	);
}	


function ShowPowerLawChart(points, fitline){
	ClearGraphCont();
	BuildEchartView();

	require(
		[
			'echarts',
			'echarts/chart/line',
			'echarts/chart/scatter'
		],
		function(ec){
			var myChart = ec.init(document.getElementById('Echart'));
			var option = {
				toolbox: {
       				show : true,
        			feature : {
            			mark : {show: true},
						dataZoom : {show: true},
            			dataView : {show: true, readOnly: false},
           				restore : {show: true},
            			saveAsImage : {show: true}
        			}
    			},
				title:{
					text:'幂律分布图'
				},
				xAxis: [{
					type : 'value',
					scale : true,
				}],
				yAxis: [{
					type : 'value',
					scale : true,
				}],
				series:[
					{
						type:'scatter',
						symbol:'circle',
						symbolSize:5,
						clickable:false,
						data: function(){
							lnpoints = [];
							for(i = 0; i < points.length; i++){
								lnpoints.push([Math.log(points[i][0]), Math.log(points[i][1])]);
							}
							return lnpoints;
						}()
					},
					{
						type: 'line',
						data: fitline
					}
				]
			}
			myChart.setOption(option);
		}
	);
}


function GraphToStr(graphId){
	gstr = "";
	for(var i = 0; i < graphs[graphId]["nodes"].length; i++){
		gstr += graphs[graphId]["nodes"][i];
		if(i < graphs[graphId]["nodes"].length - 1)
			gstr += ","
	}
	gstr += "_"
	for(var i = 0; i < graphs[graphId]["edges"].length; i++){
		gstr += graphs[graphId]["edges"][i][0] + ":" + graphs[graphId]["edges"][i][1];
		if(i < graphs[graphId]["edges"].length - 1)
			gstr += ","
	}
	return gstr;
}

function SaveGraph(graphId){
	url = accessurl + "?option=sav&graphId=" + graphId;
	var gstr = GraphToStr(graphId);
	
	url = url + "&gstr=" + gstr;

	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.onreadystatechange = UploadGraph;
	xmlHttpRequest.open("GET", url, true);
	xmlHttpRequest.send(null);

	function UploadGraph(){
		if(xmlHttpRequest.readyState == 4){
			DegreeDistributionData(graphId);	
		}
	}
}

function RefreshProCont(graphId){
	var direct = document.getElementById("direct");
	direct.innerHTML = "Directed:" + graphsinfo[graphId].direct;
	var averCC = document.getElementById("averCC");
	var loaclCC = document.getElementById("localCC");
	if(graphId in clustercs){
		averCC.innerHTML = "Average Clustering Coefficient:" + clustercs[graphId].averagecc;
		localCC.innerHTML = "Global Clustering Coefficient:" + clustercs[graphId].globalcc;
	}
	var nodesN = document.getElementById("nodesN");
	nodesN.innerHTML = "Nodes Num:" + graphs[graphId].nodes.length;
	var edgesN = document.getElementById("edgesN");
	edgesN.innerHTML = "Edges Num:" + graphs[graphId].edges.length;
	var apl = document.getElementById("apl");
	var dia = document.getElementById("diameter");
	if(graphId in aplds){
		apl.innerHTML = "Average Path Length:" + aplds[graphId].apl;
		dia.innerHTML = "Diameter:" + aplds[graphId].diameter;
	}
}

function GetAPLD(graphId){
	if(graphs[graphId]['nodes'].length > 300){
		alert("Too many nodes, server refused!");
		return;
	}
	var url = accessurl + "?option=a" + "&graphId=" + graphId + "&direct=" + graphsinfo[graphId]['direct'];
	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.onreadystatechange = LoadAPLD;
	xmlHttpRequest.open("GET", url, true);
	xmlHttpRequest.send(null);
	 	
	function LoadAPLD(){
		if(xmlHttpRequest.readyState == 4){
			var line = xmlHttpRequest.responseText.split('\n')[0];
			var arrs = line.split('||');
			var APLD = {};
			APLD['apl'] = arrs[0];
			APLD['diameter'] = arrs[1];
			
			aplds[graphId] = APLD;
			RefreshProCont(graphId);
		}
	}
}

function GetCentralityData(graphId){
	var url = accessurl + "?option=centrality" + "&graphId=" + graphId;
	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.onreadystatechange = LoadCData;
	xmlHttpRequest.open("GET", url, true);
	xmlHttpRequest.send(null);
	
	function LoadCData(){
		if(xmlHttpRequest.readyState == 4){
			var line = xmlHttpRequest.responseText.split('\n')[0];
			var cents = line.split('||');
			var centrality = {'degree':{}, 'kaz':{}, 'pageRank':{}};
			var dcents = cents[0].split('|');
			var orderdegree = [];

			for(var i = 0; i < dcents.length; i++){
				var arrs = dcents[i].split(':');
				centrality.degree[arrs[0]] = arrs[1];
				orderdegree.push({'nodeId':arrs[0], 'degree':parseInt(arrs[1])});
			}
			dcents = cents[1].split('|');
			for(var i = 0; i < dcents.length; i++){
				var arrs = dcents[i].split(':');
				centrality.kaz[arrs[0]] = arrs[1];
			}
			dcents = cents[2].split('|');
			for(var i = 0; i < dcents.length; i++){
				var arrs = dcents[i].split(':');
				centrality.pageRank[arrs[0]] = arrs[1];
			}
			
			function orderBy(degree){
				return function(a, b){
					if(a[degree] < b[degree]) return 1;
					else if(a[degree] > b[degree]) return -1;
					else return 0;
				}
			}
			orderdegree.sort(orderBy('degree'));
				
			orderdegrees[graphId] = orderdegree;
			centralitys[graphId] = centrality;
		}
	}
}

function GetClusteringCoeData(graphId){
	if(graphs[graphId].nodes.length > 300){
		alert("Too many nodes, server refused!");
		return;
	}

	var url = accessurl + "?option=cc" + "&graphId=" + graphId + "&direct=" + graphsinfo[graphId]["direct"];
	
	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.onreadystatechange = LoadCCData;
	xmlHttpRequest.open("GET", url, true);
	xmlHttpRequest.send(null);

	function LoadCCData(){
		if(xmlHttpRequest.readyState == 4){
			var clusterc = {'averagecc':0.0, 'globalcc':0.0, 'nodes':{}};

			var line = xmlHttpRequest.responseText.split('\n')[0];
			var arrs = line.split('|||');
			var ccs = arrs[0].split('||');
			
			for(var i = 0; i < ccs.length; i++){
				var node = ccs[i].split(':')[0];
				var cc = ccs[i].split(':')[1];	
				clusterc['nodes'][node] = cc;
			}
			clusterc['averagecc'] = arrs[1].split(':')[0];
			clusterc['globalcc'] = arrs[1].split(':')[1];

			clustercs[graphId] = clusterc;
			RefreshProCont(graphId);
		}
	}
}

function DegreeDistributionData(graphId){
	url = accessurl + "?option=dis&graphId=" + graphId;

	var ddRequest = new XMLHttpRequest();
	ddRequest.onreadystatechange = GetDegreeDistribution;
	ddRequest.open("GET", url, true);
	ddRequest.send(null); 

	function GetDegreeDistribution(){
		
		if(ddRequest.readyState == 4){
			var points = [];
			var fitline = [];
			var line = ddRequest.responseText;
			var arrs = line.split('|||');
			var degs = arrs[0].split('||');
			for(var i = 0; i < degs.length; i++){
				es = degs[i].split(':');
				points.push([parseInt(es[0]), parseFloat(es[1])]);
			}
			var pars = arrs[1].split(',');
			var theta = [];
			var graphpars = {};
			theta[0] = parseFloat(pars[0]);
			theta[1] = parseFloat(pars[1]);
			graphpars['maxper'] = parseFloat(pars[2]);
			graphpars['maxdper'] = parseFloat(pars[3]);
			/*
			for(i = 0; i < lineps.length; i++){
				ps = lineps[i].split(':');
				fitline.push([parseFloat(ps[0]), parseFloat(ps[1])]);
			}*/
			thetas[graphId] = theta;
			fitgraphspars[graphId] = graphpars;
			pointsets[graphId] = points;

			var lna = Math.log(theta[0]);
			var miny = 1000.0;
			var maxy = -1000.0;
			for(var i = 0; i < points.length; i++){
				if(points[i][1] > maxy){
					maxy = points[i][1];
				}
				if(points[i][1] < miny){
					miny = points[i][1];
				}
			}
			//alert([Math.log(miny),Math.log(maxy)]);
			var minx = (Math.log(miny) - lna) / (0 - theta[1]);
			var maxx = (Math.log(maxy) - lna) / (0 - theta[1]);
			fitline.push([minx, Math.log(miny)]);
			fitline.push([maxx, Math.log(maxy)]);
			//alert(fitline);
			fitlines[graphId] = fitline;
		}
	}
}

var flag = 0;

function Innodeset(node, nodes){
	for(var i = 0; i < nodes.length; i++){
		if(node == nodes[i]){
			return true;
		}
	}
	return false;
}

function LargeShow(graphId, startn, nodeN){
	//alert(graphId + nodeN);
	if(!(graphId in centralitys)){
		alert("no centrality data!");
		return;
	}
	var graphtmp = {'nodes':[], 'edges':[]};
	for(var i = startn; i < nodeN; i++){
		graphtmp.nodes.push(orderdegrees[graphId][i].nodeId);
	}
	for(var i = 0; i < graphs[graphId].edges.length; i++){
		var node1 = graphs[graphId].edges[i][0];
		var node2 = graphs[graphId].edges[i][1];
		if((Innodeset(node1, graphtmp.nodes))&&(Innodeset(node2, graphtmp.nodes))){
			graphtmp.edges.push([node1, node2]);
		}
	}
	ShowGraph('d3', graphId, graphtmp);
}

function ShowGraph(toolselect, graphId, graph){
	if(graph.nodes.length > 500){
		alert("Too many nodes! Refused!");
		return;
	}
	ClearGraphCont();
	RefreshProCont(graphId);
	//var graph = graphs[graphId];
	if(toolselect == 'd3'){
		var winHeight = document.documentElement.clientHeight;
		var winWidth = document.documentElement.clientWidth; 

		var width = winWidth * 0.74;
		var height = winHeight * 0.85;
		
		var lnodes = [];
		var ledges = [];
		var indexdic = {};

		function dblclick(d){
			d3.select(this).classed("fixed", d.fixed = false);	
		}
		function dragstart(d){
			d3.select(this).classed("fixed", d.fixed = true);
		}

			
		for(var i = 0; i < graph["nodes"].length; i++){
			var nodename = graph["nodes"][i];
			var node = {name:nodename};
			if(graphId in clustercs){
				node.cc = clustercs[graphId]["nodes"][nodename];
			}
			if(graphId in centralitys){
				node.degree = centralitys[graphId]["degree"][nodename];
				if(graph["nodes"].length <= 300){
					node.kaz = centralitys[graphId]["kaz"][nodename];	
					node.pageRank = centralitys[graphId]["pageRank"][nodename];
				}
			}
			lnodes.push(node);	
			indexdic[graph["nodes"][i]] = i;
		}
		for(var i = 0; i < graph["edges"].length; i++){
			ledges.push({source: indexdic[graph["edges"][i][0]], target: indexdic[graph["edges"][i][1]]});
		}

		var svg = d3.select("#GraphCont").append("svg")
			.attr("width",width)
			.attr("height",height)
			.attr("id","svgGraph");

		var defs = svg.append("defs");

		var arrowMarker = defs.append("marker")
							.attr("id","arrow")
							.attr("markerUnits","strokeWidth")
    						.attr("markerWidth","8")
                        	.attr("markerHeight","8")
                        	.attr("viewBox","0 -5 10 10")
                        	.attr("refX", 15)
                        	.attr("refY", 0)
                        	.attr("orient","auto");

		var arrow_path = "M0,-5L10,0L0,5";

		arrowMarker.append("path")
					.attr("d", arrow_path)
					.attr("fill", "#696969");


		var force = d3.layout.force()
			.nodes(lnodes)
			.links(ledges)
			.size([width,height])
			.gravity(.05)
			.distance(150)
			.charge(-500)
			.start();
				
		var drag = force.drag()
				.on("dragstart", dragstart);

		var svg_edges = svg.selectAll(".line")
			.data(ledges)
			.enter()
			.append("line")
			.style("stroke-width",1)
			.attr("class", "line");
			//.attr("marker-end", "url(#arrow)");
		
		if(graphsinfo[graphId].direct == 1){
			svg_edges.attr("marker-end", "url(#arrow)");
		}

		var svg_nodes = svg.selectAll(".node")
			.data(lnodes)
			.enter()
			.append("g")
			.attr("class", "node")
			.on("dblclick", dblclick)
			.call(force.drag);	

		svg_nodes.append("circle")
			.attr("r", 6);
		
		svg_nodes.append("text")
			.attr("dx", 12)
			.attr("dy", ".35em")
			.text(function(d){ return d.name});

		svg_nodes.append("title")
			.text(function(d){
				var line = "Node:" + d.name + "\n";
				if("cc" in d){
					line += "Cluster_Coefficent:" + d.cc + "\n";
				}
				if("degree" in d){
					line += "Degree_centrality:" + d.degree + "\n";
				}
				if("kaz" in d){
					line += "Katz_centrality:" + d.kaz + "\n";
					line += "PageRank_centrality:" + d.pageRank + "\n";
				}
				return line;
			});
	
		force.on("tick", function(){
				svg_edges.attr("x1",function(d){ return d.source.x; });
				svg_edges.attr("y1",function(d){ return d.source.y; });
				svg_edges.attr("x2",function(d){ return d.target.x; });
				svg_edges.attr("y2",function(d){ return d.target.y; });

				svg_nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
				//svg_nodes.attr("cx",function(d){ return d.x; });
				//svg_nodes.attr("cy",function(d){ return d.y; });
		});

	}else if(toolselect == 'echart'){
		BuildEchartView();
		require(
			[
				'echarts',
				'echarts/chart/force',
				'echarts/chart/chord',
			],
			function(ec){
				var myChart = ec.init(document.getElementById('Echart'));
				var indexdic = {};
				var option = {
					
					tooltip : {
						trigger: 'item',
						formatter: function (params) {
							if (params.indicator2) {    // is edge
								return params.indicator2 + ' - ' + params.indicator;
							} else {    // is node
								return params.name+'<br/> 聚类系数: '+params.value;
							}
						}
					},
					toolbox: {
						show : true,
						feature : {
							restore : {show: true},
							magicType: {show: true, type: ['force', 'chord']},
							saveAsImage : {show: true}
						}
					},					
					series : [
						{
							type:'force',
							ribbonType: false,
							
							itemStyle: {
								normal: {
									label: {
										show: false,
										textStyle: {
											color: '#333'
										}
									},
									nodeStyle : {
										brushType : 'both',
										borderColor : 'rgba(255,215,0,0.4)',
										borderWidth : 1,
									},
									linkStyle: {
										type: 'line',
										color: '#c0c0c0',
									},
								},
								emphasis: {
									label: {
										show: true
										// textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
									},
									nodeStyle : {
										//r: 30
									},
									linkStyle : {
										
									},
								}
							},
							useWorker: false,
							minRadius : 15,
							maxRadius : 25,
							gravity: 0,
							roam: 'scale', // 滚轮缩放
							scaling: 2, // 分散程度
							size: 450, 
							large: true,
							linkSymbol: 'arrow',
							symbolSize: 10,
							
							nodes: function(){
								tmpNodes = [];
								for(i = 0; i < graph["nodes"].length; i++){
									tmpNodes.push({name:graph["nodes"][i], value:4});//tbd聚类系数
									indexdic[graph["nodes"][i]] = i;
								}
								return tmpNodes;
							}(),
							links : function(){
								tmpLinks = [];
								for(var i=0; i < graph["edges"].length; i++){
									tmpLinks.push({source : indexdic[graph["edges"][i][0]], target : indexdic[graph["edges"][i][1]], weight:0.1});
								}
								return tmpLinks;
							}(),
						}
					]
				};
				myChart.setOption(option); // 为echarts对象加载数据 
			}
		);
	}
}

function LoadGraph(graphId, fileName){
	var url = accessurl + "?option=load&graphId="+graphId+"&filename="+fileName;
	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.onreadystatechange = LoadGraphData;
	xmlHttpRequest.open("GET", url, true);
	xmlHttpRequest.send(null);
	
	nodes = [];
	edges = [];
	graph = {};
	
	function LoadGraphData(){
		if(xmlHttpRequest.readyState == 4 ){
			var line = xmlHttpRequest.responseText.split('\n')[0];
			//line = line.split('\n')[0];

			nodearr = line.split("||")[0].split(",");
			edgearr = line.split("||")[1].split(",");
			
			var i;	
			for(i = 0; i < nodearr.length; i++)
				nodes.push(nodearr[i]);

			for(i = 0; i < edgearr.length; i++)
				edges.push([edgearr[i].split(" ")[0], edgearr[i].split(" ")[1]]);
			
			graph["nodes"] = nodes;
			graph["edges"] = edges;
				
			graphs[graphId] = graph;
			//alert(graph["nodes"].length);
			//ShowGraph("d3", graph);
			DegreeDistributionData(graphId);
		}
	}

}

function FitGraph(graphId, ograph, nodeN){
	var url = accessurl + "?option=fit";
	url = url + "&theta0=" + thetas[ograph][0] + "&theta1=" + thetas[ograph][1]
			+ "&maxper=" + fitgraphspars[ograph]['maxper'] + "&maxdper=" + fitgraphspars[ograph]['maxdper']
			+ "&nodeN=" + nodeN + "&outfileName=" + graphId + ".txt" + "&onodeN=" + graphs[ograph]['nodes'].length;
	
	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.onreadystatechange = GetFitGraphData;
	xmlHttpRequest.open("GET", url, true);
	xmlHttpRequest.send(null);

	function GetFitGraphData(){
		if(xmlHttpRequest.readyState == 4 ){
			LoadGraph(graphId, graphId + '.txt');
		}
	}
}

function RequestGraphData(graphId, option, params){
	var nodes = [];
	var edges = [];
	var url = accessurl + "?option=" + option;
	url = url + "&graphId=" + graphId;
	if(option == "randg"){	
		url = url + "&nodeN=" + params["nodeN"]	+ "&rate=" + params["rate"];
	}else if(option == "pam"){
		if(graphsinfo[graphId]["func"] == "ori"){
			url = url + "&addnodeN=" + params["addnodeN"] + "&expe=" + params["expe"] + "&func=ori";
		}else if(graphsinfo[graphId]["func"] == "poisson"){
			url = url + "&addnodeN=" + params["addnodeN"] + "&expe=" + params["expe"] + "&a=" + params["a"] + "&b=" + params["b"] + "&func=poisson"; 
		}
	}else if(option == "smallw"){
		url = url + "&nodeN=" + params["nodeN"] + "&meand=" + params["meand"] + "&prob=" + params["rate"];
	}
	
	var graph = {};

	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.onreadystatechange = GetGraphData;
	xmlHttpRequest.open("GET", url, true);
	xmlHttpRequest.send(null);
	
	function GetGraphData(){
		if(xmlHttpRequest.readyState == 4 ){
			var line = xmlHttpRequest.responseText.split('\n')[0];

			nodearr = line.split("||")[0].split(",");
			edgearr = line.split("||")[1].split(",");

			var i;	
			for(i = 0; i < nodearr.length; i++)
				nodes.push(nodearr[i]);

			for(i = 0; i < edgearr.length; i++)
				edges.push([edgearr[i].split(" ")[0], edgearr[i].split(" ")[1]]);
			
			graph["nodes"] = nodes;
			graph["edges"] = edges;
	
			graphs[graphId] = graph;
			//alert(graph["nodes"].length);
			//ShowGraph("d3", graph);
			DegreeDistributionData(graphId);
		}
	}
}

cmdlist = [];

funmethods = ['gen()', 'show()', 'calcc()', 'calcent()', 'degreedis()', 'powerlaw()', 'download()', 'editor()', 'apld()', 'refreshattr()', 'updata()', 'theta()', 'largeshow', 'ls()'];

function InMethods(mstr){
	for(var i = 0; i < funmethods.length; i++)
		if(funmethods[i] == mstr)
			return true;
	return false;
}

function Commands(cmdline){
	switch(cmdline){
		case 'help':
			var url = rooturl + "download.php?graphId=instruct";
			window.open(url);	
			break;
		case 'list':
			break;
		case 'upload':
			var url = rooturl + "upload.html"
			window.open(url);	
			break;
		case 'varls':
			var vls = '';
			for(gId in graphsinfo){
				vls += gId + '\n';
				for(p in graphsinfo[gId])
					vls += '\t' + p + ':' + graphsinfo[gId][p] + '\n';
			}
			return vls;
			break;
		default:
			var cmdpars = cmdline.split(' ');
			if(cmdpars[0] == 'new'){
				var arrs = cmdpars[1].split("=");
				var graphId = arrs[0];
				var option = arrs[1];
				var graphinfo = {};
			
				switch(option){
					case 'graph':
						graphinfo["option"]	= "graph";
						graphinfo["direct"] = 1;
						graphsinfo[graphId] = graphinfo;
						graphs[graphId] = {"nodes":[], "edges":[]};
						break;
					case 'randomgraph':
						graphinfo["option"] = "randg";
						graphinfo["nodeN"] = 50;
						graphinfo["rate"] = 0.2;
						graphinfo["direct"] = 0;
						graphsinfo[graphId] = graphinfo;
						break;
					case 'pamload':
						var initgraph = cmdline.split(' ')[2];
						graphinfo["option"] = "pam";
						graphinfo["func"] = "poisson";
						graphinfo["addnodeN"] = 1;
						graphinfo["expe"] = 5;
						graphinfo["a"] = 2;
						graphinfo["b"] = 3;
						graphinfo["direct"] = 0;
						graphsinfo[graphId] = graphinfo;
						LoadGraph(graphId, initgraph + ".txt");
						break;
					case 'smallworld':
						graphinfo["option"] = "smallw";
						graphinfo["nodeN"] = 100;
						graphinfo["meand"] = 5;
						graphinfo["rate"] = 0.5;
						graphinfo["direct"] = 0;
						graphsinfo[graphId] = graphinfo;
						break;
					case 'load':
						var filename = cmdpars[2];
						graphinfo["option"] = "load";
						graphinfo["direct"] = 0;
						graphinfo["filename"] = filename;
						graphsinfo[graphId] = graphinfo;
						LoadGraph(graphId, filename);	
						break;
					case 'fitgraph':
						var orgingraph = cmdpars[2];
						var nodeN = cmdpars[3];
						graphinfo["option"] = "fit";
						graphinfo["direct"] = 0;
						graphinfo["nodeN"] = nodeN;
						graphsinfo[graphId] = graphinfo;
						FitGraph(graphId, orgingraph, nodeN);
						break;
					default:
						return "E0";
				}
			}else{
				var arrs = cmdpars[0].split('.');
				var graphId = arrs[0];
				if(graphId in graphsinfo){
					//alert(graphId);
					if(InMethods(arrs[1])){
						var func = arrs[1];
						switch(func){
							case 'gen()':
								RequestGraphData(graphId, graphsinfo[graphId]["option"], graphsinfo[graphId]);
								break;
							case 'show()':
								ShowGraph("d3", graphId, graphs[graphId]);
								break;
							case 'calcc()':
								GetClusteringCoeData(graphId);
								break;
							case 'calcent()':
								GetCentralityData(graphId);
								break;
							case 'degreedis()':
								ShowDegreeDisChart(pointsets[graphId]);
								RefreshProCont(graphId);
								break;
							case 'powerlaw()':
								ShowPowerLawChart(pointsets[graphId], fitlines[graphId]);
								RefreshProCont(graphId);
								break;
							case 'download()':	
								var url = rooturl + "download.php?graphId=" + graphId;
								window.open(url);
								break;
							case 'editor()':
								GraphEditor(graphId);
								break;
							case 'apld()':
								GetAPLD(graphId);
								break;
							case 'refreshattr()':
								RefreshProCont(graphId);
								break;																		
							case 'updata()':
								GetAPLD(graphId);	
								GetClusteringCoeData(graphId);
								RefreshProCont(graphId);
								break;
							case 'theta()':
								alert('a:' + thetas[graphId][0] + ' b:' + thetas[graphId][1]);
								break;
							case 'ls()':
								var ls = '';
								for(p in graphsinfo[graphId]){
									ls += p + ':' + graphsinfo[graphId][p] + '\n';
								}
								return ls;
								break;
							case 'largeshow':
								if(cmdpars.length >= 3){
									LargeShow(graphId, parseInt(cmdpars[1]), parseInt(cmdpars[2]));	
								}else if(cmdpars.length == 2){
									LargeShow(graphId, 0, parseInt(cmdpars[1]));
								}
								break;
							default:
								return 'E2';
						}
					}else{
						var parline = arrs[1];
						if(arrs.length >= 3){
							parline += '.' + arrs[2];
						}
						var parm = parline.split('=')[0];
						var val = parline.split('=')[1];
						if(parm in graphsinfo[graphId]){
							switch(parm){
								case 'nodeN':
								case 'expe':
								case 'meand':
								case 'addnodeN':
								case 'a':
								case 'b':
									graphsinfo[graphId][parm] = parseInt(val);
									break;
								case 'direct':
									graphsinfo[graphId][parm] = parseInt(val);
									GetClusteringCoeData(graphId);
									break;
								case 'rate':
									graphsinfo[graphId][parm] = parseFloat(val);
									break;
								case 'func':
									graphsinfo[graphId][parm] = val;
									break;
								default:
									return 'E2';
							}
						}else{
							return 'E2';
						}
					}
				}else{
					return "E1";
				}
			}
	}
	return "OK";
}

function textChange(txt){
	if(txt[txt.length - 1] == '\n'){
		var command = document.getElementById('Command');
		cmds = command.value.split(">>");
		cmd = cmds[cmds.length - 1].split('\n')[0];

		if(cmd == "clear"){
			command.value = ">>";
		}else{
			var backins = Commands(cmd);
			if(backins == "E1"){
				command.value += "Undefine Var\n>>";
			}else if(backins == "E2"){
				command.value += "Paramter Error\n>>";	
			}else if(backins == "E0"){
				command.value += "Unknow Commands\n>>"
			}else if(backins == "OK"){
				command.value += ">>";
			}else{
				command.value += backins + ">>";	
			}
		}
	}
}


function ConfirmGraph(){
	graphs[EgraphId] = Egraph;
	alert("graph has been saved!");
	
	SaveGraph(EgraphId);
	//ClearGraphCont();
	document.getElementById("Command").focus();
}

function GraphEditor(graphId){
	
	ClearGraphCont();

	EgraphId = graphId;
	var mygraph = graphs[graphId];
	
	function addConfirmButton(){
		var html ="<input type=\"button\" value=\"确认\" onclick=\"ConfirmGraph();\">";
		document.getElementById("GraphCont").innerHTML=html;
	}

	addConfirmButton();

	var winHeight = document.documentElement.clientHeight;
	var winWidth = document.documentElement.clientWidth; 

	var width = winWidth * 0.70;
	var height = winHeight * 0.80;

//	var width  = 960,
//		height = 500,
	colors = d3.scale.category10();

	var svg = d3.select('#GraphCont')
	  .append('svg')
	  .attr('width', width)
	  .attr('height', height);

	// set up initial nodes and links
	//  - nodes are known by 'id', not by index in array.
	//  - reflexive edges are indicated on the node (as a bold black circle).
	//  - links are always source < target; edge directions are set by 'left' and 'right'.

	if(mygraph["nodes"].length == 0){
		mygraph["nodes"].push(1);
	}

	nodes=new Array()
	var nodes_id=new Array()
	nodes.push({id:mygraph["nodes"][0],reflexive:true})
	nodes_id[mygraph["nodes"][0]]=0
	for(var i=1;i<mygraph["nodes"].length;i++){
		nodes.push({id:mygraph["nodes"][i],reflexive:false})
		//console.log('id : '+mygraph["nodes"][i])
		nodes_id[mygraph["nodes"][i]]=i
	}

	lastNodeId=mygraph["nodes"][mygraph["nodes"].length-1]
	links=new Array()
	for(var i=0;i<mygraph["edges"].length;i++){
		var node_source=mygraph["edges"][i][0]
		var node_target=mygraph["edges"][i][1]
		if(node_source<node_target){
			links.push({source: nodes[nodes_id[node_source]], target: nodes[nodes_id[node_target]], left: false, right: true })
		}else{
			links.push({source: nodes[nodes_id[node_target]], target: nodes[nodes_id[node_source]], left: true, right: false })
		}
		
	}
	

	// init D3 force layout
	var force = d3.layout.force()
		.nodes(nodes)
		.links(links)
		.size([width, height])
		.linkDistance(150)
		.charge(-500)
		.on('tick', tick)

	// define arrow markers for graph links
	svg.append('svg:defs').append('svg:marker')
		.attr('id', 'end-arrow')
		.attr('viewBox', '0 -5 10 10')
		.attr('refX', 6)
		.attr('markerWidth', 3)
		.attr('markerHeight', 3)
		.attr('orient', 'auto')
	  .append('svg:path')
		.attr('d', 'M0,-5L10,0L0,5')
		.attr('fill', '#000');

	svg.append('svg:defs').append('svg:marker')
		.attr('id', 'start-arrow')
		.attr('viewBox', '0 -5 10 10')
		.attr('refX', 4)
		.attr('markerWidth', 3)
		.attr('markerHeight', 3)
		.attr('orient', 'auto')
	  .append('svg:path')
		.attr('d', 'M10,-5L0,0L10,5')
		.attr('fill', '#000');

	// line displayed when dragging new nodes
	var drag_line = svg.append('svg:path')
	  .attr('class', 'link dragline hidden')
	  .attr('d', 'M0,0L0,0');

	// handles to link and node element groups
	var path = svg.append('svg:g').selectAll('path'),
		circle = svg.append('svg:g').selectAll('g');

	// mouse event vars
	var selected_node = null,
		selected_link = null,
		mousedown_link = null,
		mousedown_node = null,
		mouseup_node = null;

	function resetMouseVars() {
	  mousedown_node = null;
	  mouseup_node = null;
	  mousedown_link = null;
	}

	// update force layout (called automatically each iteration)
	function tick() {
	  // draw directed edges with proper padding from node centers
	  path.attr('d', function(d) {
		var deltaX = d.target.x - d.source.x,
			deltaY = d.target.y - d.source.y,
			dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
			normX = deltaX / dist,
			normY = deltaY / dist,
			sourcePadding = d.left ? 17 : 12,
			targetPadding = d.right ? 17 : 12,
			sourceX = d.source.x + (sourcePadding * normX),
			sourceY = d.source.y + (sourcePadding * normY),
			targetX = d.target.x - (targetPadding * normX),
			targetY = d.target.y - (targetPadding * normY);
	//    console.log('M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY)
		return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
	  });

	  circle.attr('transform', function(d) {
	//  	console.log('dot:'+d.x+"  "+d.y)
		return 'translate(' + d.x + ',' + d.y + ')';
	  });
	}

	// update graph (called when needed)
	function restart() {
	  // path (link) group
	  path = path.data(links);
	  for(var i=0;i<links.length;i++){

	  }
	  // update existing links
	  path.classed('selected', function(d) { return d === selected_link; })
		.style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
		.style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; });


	  // add new links
	  path.enter().append('svg:path')
		.attr('class', 'link')
		.classed('selected', function(d) { return d === selected_link; })
		.style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
		.style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; })
		.on('mousedown', function(d) {
		  if(d3.event.ctrlKey) return;

		  // select link
		  mousedown_link = d;
		  if(mousedown_link === selected_link) selected_link = null;
		  else selected_link = mousedown_link;
		  selected_node = null;
		  restart();
		});

	  // remove old links
	  path.exit().remove();


	  // circle (node) group
	  // NB: the function arg is crucial here! nodes are known by id, not by index!
	  circle = circle.data(nodes, function(d) { return d.id; });

	  // update existing nodes (reflexive & selected visual states)
	  circle.selectAll('circle')
		.style('fill', function(d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
		.classed('reflexive', function(d) { return d.reflexive; });

	  // add new nodes
	  var g = circle.enter().append('svg:g');

	  g.append('svg:circle')
		.attr('class', 'node')
		.attr('r', 12)
		.style('fill', function(d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
		.style('stroke', function(d) { return d3.rgb(colors(d.id)).darker().toString(); })
		.classed('reflexive', function(d) { return d.reflexive; })
		.on('mouseover', function(d) {
		  if(!mousedown_node || d === mousedown_node) return;
		  // enlarge target node
		  d3.select(this).attr('transform', 'scale(1.1)');
		})
		.on('mouseout', function(d) {
		  if(!mousedown_node || d === mousedown_node) return;
		  // unenlarge target node
		  d3.select(this).attr('transform', '');
		})
		.on('mousedown', function(d) {
		  if(d3.event.ctrlKey) return;

		  // select node
		  mousedown_node = d;
		  if(mousedown_node === selected_node) selected_node = null;
		  else selected_node = mousedown_node;
		  selected_link = null;

		  // reposition drag line
		  drag_line
			.style('marker-end', 'url(#end-arrow)')
			.classed('hidden', false)
			.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);

		  restart();
		})
		.on('mouseup', function(d) {
		  if(!mousedown_node) return;

		  // needed by FF
		  drag_line
			.classed('hidden', true)
			.style('marker-end', '');

		  // check for drag-to-self
		  mouseup_node = d;
		  if(mouseup_node === mousedown_node) { resetMouseVars(); return; }

		  // unenlarge target node
		  d3.select(this).attr('transform', '');

		  // add link to graph (update if exists)
		  // NB: links are strictly source < target; arrows separately specified by booleans
		  var source, target, direction;
		  if(mousedown_node.id < mouseup_node.id) {
			source = mousedown_node;
			target = mouseup_node;
			direction = 'right';
		  } else {
			source = mouseup_node;
			target = mousedown_node;
			direction = 'left';
		  }

		  var link;
		  link = links.filter(function(l) {
			return (l.source === source && l.target === target);
		  })[0];

		  if(link) {
			link[direction] = true;
		  } else {
			link = {source: source, target: target, left: false, right: false};
			link[direction] = true;
			links.push(link);
		  }

		  // select new link
		  selected_link = link;
		  selected_node = null;
		  restart();
		});

	  // show node IDs
	  g.append('svg:text')
		  .attr('x', 0)
		  .attr('y', 4)
		  .attr('class', 'id')
		  .text(function(d) { return d.id; });

	  // remove old nodes
	  circle.exit().remove();

	  // set the graph in motion
	  force.start();
	   

	  Egraph = new Array()
	  Egraph["nodes"]=new Array()
	  Egraph["edges"]=new Array()
	  Egraph["directed"]=1 
	  for(var i=0;i<links.length;i++){
		if(!links[i].left){
			Egraph["edges"].push([links[i].source.id,links[i].target.id])
		}else{
			Egraph["edges"].push([links[i].target.id,links[i].source.id])
		}

	 // 	console.log("source:%s,target:%s,left:%s,right:%s", links[i].source.id,links[i].target.id,links[i].left,links[i].right);
	  }
	  for(var i=0;i<nodes.length;i++){
		Egraph["nodes"].push(nodes[i].id)
	  }
	/*
	  console.log(Egraph["nodes"].join('_'))
	  for(var i=0;i<Egraph["edges"].length;i++){
		console.log(Egraph["edges"][i].join("-->"))
	  }
	*/	
	}

	function mousedown() {
	  // prevent I-bar on drag
	  //d3.event.preventDefault();
	  
	  // because :active only works in WebKit?
	  svg.classed('active', true);

	  if(d3.event.ctrlKey || mousedown_node || mousedown_link) return;

	  // insert new node at point
	  var point = d3.mouse(this),
		  node = {id: ++lastNodeId, reflexive: false};
	  node.x = point[0];
	  node.y = point[1];
	  nodes.push(node);

	  restart();
	}

	function mousemove() {
	  if(!mousedown_node) return;

	  // update drag line
	  drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);

	  restart();
	}

	function mouseup() {
	  if(mousedown_node) {
		// hide drag line
		drag_line
		  .classed('hidden', true)
		  .style('marker-end', '');
	  }

	  // because :active only works in WebKit?
	  svg.classed('active', false);

	  // clear mouse event vars
	  resetMouseVars();
	}

	function spliceLinksForNode(node) {
	  var toSplice = links.filter(function(l) {
		return (l.source === node || l.target === node);
	  });
	  toSplice.map(function(l) {
		links.splice(links.indexOf(l), 1);
	  });
	}

	// only respond once per keydown
	var lastKeyDown = -1;

	function keydown() {
	  //d3.event.preventDefault();

	  if(lastKeyDown !== -1) return;
	  lastKeyDown = d3.event.keyCode;

	  // ctrl
	  if(d3.event.keyCode === 17) {
		circle.call(force.drag);
		svg.classed('ctrl', true);
	  }

	  if(!selected_node && !selected_link) return;
	  switch(d3.event.keyCode) {
		case 8: // backspace
		case 46: // delete
		  if(selected_node) {
			nodes.splice(nodes.indexOf(selected_node), 1);
			spliceLinksForNode(selected_node);
		  } else if(selected_link) {
			links.splice(links.indexOf(selected_link), 1);
		  }
		  selected_link = null;
		  selected_node = null;
		  restart();
		  break;
		case 66: // B
		  if(selected_link) {
			// set link direction to both left and right
			selected_link.left = true;
			selected_link.right = true;
		  }
		  restart();
		  break;
		case 76: // L
		  if(selected_link) {
			// set link direction to left only
			selected_link.left = true;
			selected_link.right = false;
		  }
		  restart();
		  break;
		case 82: // R
		  if(selected_node) {
			// toggle node reflexivity
			selected_node.reflexive = !selected_node.reflexive;
		  } else if(selected_link) {
			// set link direction to right only
			selected_link.left = false;
			selected_link.right = true;
		  }
		  restart();
		  break;
	  }
	}

	function keyup() {
	  lastKeyDown = -1;

	  // ctrl
	  if(d3.event.keyCode === 17) {
		circle
		  .on('mousedown.drag', null)
		  .on('touchstart.drag', null);
		svg.classed('ctrl', false);
	  }
	}

	// app starts here
	svg.on('mousedown', mousedown)
	  .on('mousemove', mousemove)
	  .on('mouseup', mouseup);
	d3.select(window)
	  .on('keydown', keydown)
	  .on('keyup', keyup);
	restart();

}
