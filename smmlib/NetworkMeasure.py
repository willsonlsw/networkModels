import sys
import numpy as np
from scipy.stats import poisson
import random
#import sklearn
#from LoadGraph import LoadGraph
#from LoadGraph import FormatOutput
from RandomGraphGen import Gnp_Random_Graph
#from AveragePathLen import AveragePathLength
#from AveragePathLen import Diameter
from APLD import AveragePathLength
from APLD import Diameter
from PreferentialAttachment import preferential_attachment_gen
from PreferentialAttachment import poisson_growth_gen

current_G_path = 'current_G.txt'

def LoadGraph(fpath):
	graph = {}
	graph['nodes'] = []
	graph['edges'] = []
	f = open(fpath)
	global tnodeN
	global tedgeN
	tnodeN = int(f.readline())
	for i in range(0, tnodeN):
		line = f.readline()
		graph['nodes'].append(int(line.split('\n')[0]));

	lines = f.readlines()
	tedgeN = len(lines)
	for line in lines:
		graph['edges'].append([int(line.split(' ')[0]), int(line.split(' ')[1].split('\n')[0])])
	
	return graph

def BuildUp(graph, tnodeN):
	G = {}
	G['edges'] = []
	G['nodes'] = []
	for edge in graph:
		G['edges'].append([edge[0], edge[1]])
	for i in range(0, tnodeN):
		G['nodes'].append(i)
	'''
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

	for i in range(len(nodes), tnodeN):
		G['nodes'].append(i)

	for edge in graph:
		G['edges'].append([nodes[edge[0]], nodes[edge[1]]])
	'''
	return G


def FormatOutput(graph):
	#graph = BuildUp(G, nodeN)
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

def WriteCurrentGraph(graph):
	f = open(current_G_path, 'w')
	f.write("%d\n"%len(graph['nodes']))
	for node in graph['nodes']:
		f.write("%d\n"%node)
	for edge in graph['edges']:
		f.write("%d %d\n"%(int(edge[0]), int(edge[1])))
	f.close()

def GetNodeN(graph):
	nodes = {}
	nodeN = 0
	maxnode = 0
	for edge in graph:
		if not edge[0] in nodes:
			if int(edge[0]) > maxnode:
				maxnode = int(edge[0])
			nodes[edge[0]] = nodeN
			nodeN += 1
		if not edge[1] in nodes:
			if int(edge[1]) > maxnode:
				maxnode = int(edge[1])
			nodes[edge[1]] = nodeN
			nodeN += 1
	return maxnode

if __name__ == '__main__':
	tnodeN = 0
	tedgeN = 0
	if sys.argv[1] == 'r':
		current_G_path = 'data/' + sys.argv[4] + '.txt'
		graph = BuildUp(Gnp_Random_Graph(int(sys.argv[2]), float(sys.argv[3])), int(sys.argv[2]))
		WriteCurrentGraph(graph)
		FormatOutput(graph)
	elif sys.argv[1] == 'a':
		current_G_path = 'data/' + sys.argv[2] + '.txt'
		graph = LoadGraph(current_G_path)
		direct = int(sys.argv[3])
		#nodeN = GetNodeN(graph)
		#apl = AveragePathLength(graph["edges"], tnodeN, 0)
		#diameter = Diameter(graph["edges"], tnodeN, 0)
		apl = AveragePathLength(graph["nodes"], graph['edges'], direct)
		diameter = Diameter(graph["nodes"], graph['edges'], direct)
		print "%f||%d"%(apl, diameter)	
	elif sys.argv[1] == 'p':
		current_G_path = 'data/' + sys.argv[5] + '.txt'
		init_G = LoadGraph(current_G_path)
		func = sys.argv[2]
		expe = int(sys.argv[3])
		addnodeN = int(sys.argv[4])
		if func == 'ori':
			graph = preferential_attachment_gen(init_G, expe, addnodeN)
		else:
			a = int(sys.argv[6])
			b = int(sys.argv[7])
			graph = poisson_growth_gen(init_G, a, b, expe, addnodeN)

		WriteCurrentGraph(graph)
		FormatOutput(graph)
