import sys
import math
import numpy as np

'''
def LoadGraph(fpath):
	G = {}
	G['nodes'] = []
	G['edges'] = []

	f = open(fpath, 'r')
	line = f.readline()
	nodeN = int(line.split('\n')[0])
	for i in range(0, nodeN):
		line = f.readline()
		G['nodes'].append(line.split('\n')[0])
	lines = f.readlines()
	for line in lines:
		arrs = line.split(' ')
		G['edges'].append([arrs[0], arrs[1].split('\n')[0]])
	
	return G


def get_degree_centrality(graph):
	nodesd = {}
	for node in graph['nodes']:
		nodesd[node] = 0
	
	for edge in graph['edges']:
		nodesd[edge[0]] += 1
		nodesd[edge[1]] += 1
	
	return nodesd


def get_kaz_centrality():
'''	

def get_degree_centrality(fpath):
	f = open(fpath, 'r')
	nodes = {}
	nodeN = int(f.readline().split('\n')[0])
	for i in range(0, nodeN):
		node = f.readline().split('\n')[0]
		nodes[node] = 0
	lines = f.readlines()
	#print nodeN

	for line in lines:
		arr = line.split('\n')[0].split(' ')
		#print line,arr
		nodes[arr[0]] += 1
		nodes[arr[1]] += 1

	f.close()
	return nodes

def get_pagerank_centrality(fpath):
	f = open(fpath, 'r')
	nodes = {}
	nodes_id={}
	id_nodes={}
	nodeN = int(f.readline().split('\n')[0])
	for i in range(0, nodeN):
		node = f.readline().split('\n')[0]
		nodes[i]=0
		nodes_id[node] = i
		id_nodes[i]=node
	lines = f.readlines()
	matrix=np.zeros((nodeN,nodeN))
	Degree=np.zeros((nodeN,nodeN))
	for line in lines:
		arr = line.split('\n')[0].split(' ')
		nodes[nodes_id[arr[0]]] += 1
		nodes[nodes_id[arr[1]]] += 1
		matrix[nodes_id[arr[0]],nodes_id[arr[1]]]=1
		matrix[nodes_id[arr[1]],nodes_id[arr[0]]]=1
	for i in range(nodeN):
		Degree[i,i]=nodes[i]
	matrix=np.matrix(matrix)
	Degree=np.matrix(Degree)
	E=np.eye(nodeN)
	x = np.array([1]*nodeN)
	result=np.dot((E-np.dot(matrix,Degree.I)*0.95).I*0.1,(x.T))
	#print(result)
	pagerank_centrality={}
	for key in id_nodes:
		pagerank_centrality[id_nodes[key]]= result[0,key]
	#print pagerank_centrality
	f.close()
	return pagerank_centrality
	
def get_kaz_centrality(fpath):
	f = open(fpath, 'r')
	nodes = {}
	nodes_id={}
	id_nodes={}
	nodeN = int(f.readline().split('\n')[0])
	for i in range(0, nodeN):
		node = f.readline().split('\n')[0]
		nodes[i]=0
		nodes_id[node] = i
		id_nodes[i]=node
	lines = f.readlines()
	matrix=np.zeros((nodeN,nodeN))
	for line in lines:
		arr = line.split('\n')[0].split(' ')
		nodes[nodes_id[arr[0]]] += 1
		nodes[nodes_id[arr[1]]] += 1
		matrix[nodes_id[arr[0]],nodes_id[arr[1]]]=1
		matrix[nodes_id[arr[1]],nodes_id[arr[0]]]=1
	x=np.array([[0,1,0],[1,0,1],[0,1,0]])
	matrix=np.matrix(matrix)
	E=np.eye(nodeN)
	x = np.array([1]*nodeN);
	result=np.dot((E-matrix.T*0.25).I*0.2,x.T)
	kaz_centrality={}
	for key in id_nodes:
		kaz_centrality[id_nodes[key]]= result[0,key]
	#print kaz_centrality
	f.close()
	return kaz_centrality


def CFormatOutput(cents):
	linestr = ""
	for node in cents['degree']:
		linestr += node + ':' + str(cents['degree'][node]) + '|'
	linestr += '|'
	for node in cents['kaz']:
		linestr += node + ':' + str(cents['kaz'][node]) + '|'
	linestr += '|'
	for node in cents['pageRank']:
		linestr += node + ':' + str(cents['pageRank'][node]) + '|'
	linestr += '|'
	
	print linestr,


def FormatOutput(name, cent):
	linestr = name + '||'
	for node in cent:
		linestr += node + ':' + str(cent[node]) + '|'
	linestr += '|'
	print linestr


if __name__ == '__main__':
	fpath = 'data/' + sys.argv[1] + '.txt'
	#fpath = 'g1.txt'
	#graph = LoadGraph('data/' + graphId + '.txt');
	'''
	if(sys.argv[2] == 'degree'):
		FormatOutput('degree', get_degree_centrality(fpath))
	elif(sys.argv[2] == 'kaz'):
		FormatOutput('kaz', get_kaz_centrality(fpath))
	elif(sys.argv[2] == 'pageRank'):
		FormatOutput('pageRank', get_pagerank_centrality(fpath))
	'''
	cent = {'kaz':{}, 'pageRank':{}, 'degree':{}}
	cent['degree'] = get_degree_centrality(fpath)
	if len(cent['degree']) <= 300:
		cent['kaz'] = get_kaz_centrality(fpath)
		cent['pageRank'] = get_pagerank_centrality(fpath)
	
	CFormatOutput(cent)	
	
