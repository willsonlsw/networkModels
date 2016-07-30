<?php
/*	echo "hello";
	if(isset($_GET['option'])){
		echo $_GET['option'];
		$option = $_GET['option'];
		if ($option === "r"){
			$nodeN = $_GET['nodeN'];
			$rate = $_GET['rate'];
			$graph = exec('python ./NetworkMeasure.py '.$option.' '.$nodeN.' '.$rate);
			echo $graph
		} elseif (isset($_GET['APL'])){
			$aplAdia = exec('python ./NetworkMeasure.py a');
			echo $alpAdia;	
		}
	}*/

	if(isset($_GET['option'])){
		$option = $_GET['option'];
		$graphId = $_GET['graphId'];
		if($option == 'a'){
			$direct = $_GET['direct'];
			system('python smmlib/NetworkMeasure.py a '.$graphId.' '.$direct);
		}elseif($option == 'randg'){
			$nodeN = $_GET['nodeN'];
			$rate = $_GET['rate'];
			system("python smmlib/NetworkMeasure.py r ".$nodeN." ".$rate." ".$graphId);
		}elseif($option == 'pam'){
			$func = $_GET['func'];
			$addnodeN = $_GET['addnodeN'];
			$expe = $_GET['expe'];
			if($func == 'ori'){
				system('python smmlib/NetworkMeasure.py p '.$func.' '.$expe.' '.$addnodeN.' '.$graphId);
			}elseif($func == 'poisson'){
				$a = $_GET['a'];
				$b = $_GET['b'];
				system('python smmlib/NetworkMeasure.py p '.$func.' '.$expe.' '.$addnodeN.' '.$graphId.' '.$a.' '.$b);
			}
		}elseif($option == 'smallw'){
			$nodeN = $_GET['nodeN'];
			$meand = $_GET['meand'];
			$prob = $_GET['prob'];
			system('smmlib/smallworld '.$nodeN.' '.$meand.' '.$prob.' '.$graphId);
		}elseif($option == 'load'){
			$filename = $_GET['filename'];
			system('python smmlib/load_graph.py '.$filename.' '.$graphId);
		}elseif($option == 'dis'){
			system('python smmlib/DegreeDistribution.py '.$graphId);
		}elseif($option == 'cc'){
			$direct = $_GET['direct'];
			if($direct == '1'){
				system('python smmlib/clustering_coefficient_dg.py '.$graphId);
			}else{
				system('python smmlib/clustering_coefficient_udg.py '.$graphId);
			}
		}elseif($option == 'fit'){
			$theta0 = $_GET['theta0'];
			$theta1 = $_GET['theta1'];
			$maxper = $_GET['maxper'];
			$maxdper = $_GET['maxdper'];
			$nodeN = $_GET['nodeN'];
			$onodeN = $_GET['onodeN'];
			$outfileName = $_GET['outfileName'];
			system('python smmlib/FitGraph.py '.$theta0.' '.$theta1.' '.$maxper.' '.$maxdper.' '.$nodeN.' '.$onodeN.' '.$outfileName);
		}elseif($option == 'sav'){
			$gstr = $_GET['gstr'];
			system('python smmlib/SaveGraph.py '.$graphId.' '.$gstr, $er);
		}elseif($option == 'centrality'){
			system('python smmlib/Centrality.py '.$graphId);
		}
	}
?>
