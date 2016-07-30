import sys
import random
import math

def Gnp_Random_Graph(n, p, seed=None):
    '''
    Return a random graph G{n,p}.
    
    Parameters
    ----------
    n : int
        The fixed number of nodes.
    p : float
        Probability for an edge of the (n)(n-1)/2 edges that can be formed.
    seed : int, optional
        Seed for random number generator (default=None).
    
    This is an O(n^2) algorithm. For sparse graphs (small p) see SpaseRandomGraphGen.
    '''    
    if not seed is None:
        random.seed(seed)

    G=[] # Initialize the graph with 0 edges
    for u in xrange(n):
        for v in xrange(u+1,n):
            if random.random() < p:
                G.append([u,v])
    return G

def LoadGraph(fpath):
	graph = []
	f = open(fpath)
	lines = f.readlines()
	for line in lines:
		graph.append([int(line.split(' ')[0]), int(line.split(' ')[1].split('\n')[0])])
	
	return graph


def BuildUp(graph, tnodeN):
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

	for i in range(len(nodes), tnodeN):
		G['nodes'].append(i)

	for edge in graph:
		G['edges'].append([nodes[edge[0]], nodes[edge[1]]])
	
	return G


def FormatOutput(G, nodeN):
	graph = BuildUp(G, nodeN)
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
	graph = LoadGraph(sys.argv[1])
	print graph
