import math
import random
import copy
import sys
from FormatOutput import FormatOutput

def QGraphGen(nodesd):
	nodesdegree = copy.deepcopy(nodesd)
	nodeset = set()
	edges = []

	for node in nodesdegree:
		if nodesdegree[node] > 0:
			nodeset.add(node)
	
	for node in nodesdegree:
		if node in nodeset:
			nodeset.remove(node)
		else:
			continue

		sn = min(nodesdegree[node], len(nodeset))
		nlist = random.sample(nodeset, sn)
		
		for nod in nlist:
			edges.append([node, nod])
			nodesdegree[nod] -= 1
			if nodesdegree[nod] <= 0:
				nodeset.remove(nod)

	G = {}
	G['nodes'] = []
	G['edges'] = []
	for node in nodesd:
		G['nodes'].append(node)
	for edge in edges:
		G['edges'].append(edge)

	#print len(G['edges'])	
	return G


def GraphGen(nodes):
	dset = set()
	nodesd = copy.deepcopy(nodes)

	edges = []
	for node in nodes:
		for i in range(0, nodes[node]):
			dset.add(str(node) + ':' + str(i))

	#print "set OK",len(dset)
	
	for node in nodes:
		if nodesd[node] <= 0:
			continue
		
		for i in range(0, nodes[node]):
			if (str(node) + ':' + str(i)) in dset:
				dset.remove(str(node) + ':' + str(i))
			
		for i in range(0, nodesd[node]):
			next_node = int(random.sample(dset, 1)[0].split(':')[0])
			edges.append([node, next_node])
			nodesd[next_node] -= 1
	
	G = {}
	G['nodes'] = []
	G['edges'] = []
	for node in nodes:
		G['nodes'].append(node)
	for edge in edges:
		G['edges'].append(edge)

	#print len(G['edges'])	
	return G


def RandomDegrees(theta, mper, nodeN, onodeN, maxdPer):
	ddic = {}
	nodeDegrees = {}
	mperx = (mper / theta[0])**(-1.0/theta[1])
	maxdy = theta[0] * (nodeN ** (-theta[1]))
	maxDegreeN = int(mper * nodeN) + 1
	maxDegree = int(maxdPer * nodeN) + 1

	ratio = math.log(nodeN) / math.log(onodeN);
	print ratio
	
	for nodei in range(0, nodeN):
		while 1:
			y = random.uniform(maxdy, mper)
			x = ((y / theta[0])**(-1.0 / theta[1])) * ratio
			
			degree = int(round(x))
			if degree > maxDegree:
				continue 

			if degree in ddic:
				if ddic[degree] + 1 > maxDegreeN * random.uniform(0.9, 1.1):
					continue
				else:
					ddic[degree] += 1
					nodeDegrees[nodei] = degree
					break
			else:
				ddic[degree] = 1
				nodeDegrees[nodei] = degree
				break
					
	return nodeDegrees


def WriteToFile(graph, path):
	f = open(path, 'w')
	f.write("%d\n"%len(graph['nodes']))
	for node in graph['nodes']:
		f.write("%d\n"%node)
	for edge in graph['edges']:
		f.write("%d %d\n"%(edge[0], edge[1]))
	f.close()

	print "Graph OK!"


if __name__ == '__main__':
	theta = [float(sys.argv[1]), float(sys.argv[2])]
	maxper = float(sys.argv[3])
	maxdPer = float(sys.argv[4])
	nodeN = int(sys.argv[5])
	onodeN = int(sys.argv[6])
	
	degrees = RandomDegrees(theta, maxper, nodeN, onodeN, maxdPer)
	graph = QGraphGen(degrees)

	WriteToFile(graph, "data/" + sys.argv[7])
	#FormatOutput(graph)
