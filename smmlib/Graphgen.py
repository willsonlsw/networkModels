import random
import sys

def GraphGen(nodeN, rate):
	graph = {}
	graph['nodes'] = []
	graph['edges'] = []

	for i in range(0, nodeN):
		graph['nodes'].append(i)
	
	for i in range(0, nodeN):
		for j in range(0, nodeN):
			if i == j:
				continue
			if float(random.randint(0,100) / 100.0) <= rate:
				edge = [i, j]
				graph['edges'].append(edge)
	
	return graph


def BuildUp(graph):
	G = {}
	G['edges'] = []
	G['nodes'] = []
	nodeN = 0
	nodes = {}
	for edge in graph:
		if not edge[0] in nodes:
			nodes[edge[0]] = nodeN
			nodeN += 1
		if not edge[1] in nodes:
			nodes[edge[1]] = nodeN
			nodeN += 1
	
	for key in nodes.keys():
		G['nodes'].append(key)

	for edge in graph:
		G['edges'].append([nodes[edge[0]], nodes[edge[1]]])
	
	return G

def LoadGraph(fpath):
	graph = []
	f = open(fpath, 'r')
	lines = f.readlines()
	for line in lines:
		graph.append([line.split(' ')[0], line.split(' ')[1].split('\n')[0]])
	
	return BuildUp(graph)


def FormatOutput(graph):
	strline = ''

	for i in range(0, len(graph['nodes'])):
		strline += str(i)
		if i < len(graph['nodes']) - 1:
			strline += ','
	strline += '||'
	
	for i in range(0, len(graph['edges'])):
		strline += str(graph['edges'][i][0]) + ' ' + str(graph['edges'][i][1])
		if i < len(graph['edges']) - 1:
			strline += ','
	
	print strline

if __name__ == '__main__':
	parN = len(sys.argv)
	nodeN = 100
	rate = 0.1
	if parN == 3:
		nodeN = int(sys.argv[1])
		rate = float(sys.argv[2])
		graph = GraphGen(nodeN, rate)
	elif parN == 2:
		graph = LoadGraph(sys.argv[1])
	
	FormatOutput(graph)
