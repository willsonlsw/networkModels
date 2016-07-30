import sys

newfp = ''
gformat = 0
'''
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
'''
def BuildUp(graph):
	G = {}
	G['nodes'] = []
	G['edges'] = []
	nset = set()
	for edge in graph:
		if not edge[0] in nset:
			nset.add(edge[0])
		if not edge[1] in nset:
			nset.add(edge[1])
	
	for nod in nset:
		G['nodes'].append(nod)
	for edge in graph:
		G['edges'].append([edge[0], edge[1]])
	
	return G

def LoadGraph(fpath):
	global gformat
	graph = []
	f = open(fpath, 'r')
	lines = f.readlines()
	if len(lines[0].split(' ')) > 1:
		gformat = 0
		for line in lines:
			graph.append([line.split(' ')[0], line.split(' ')[1].split('\n')[0]])
		return BuildUp(graph)

	else:
		gformat = 1
		G = {}
		G['nodes'] = []
		G['edges'] = []
		nodeN = int(lines[0])
		for i in range(1, len(lines)):
			arrs = lines[i].split(' ')
			if len(arrs) == 1:
				G['nodes'].append(arrs[0].split('\n')[0])
			else:
				G['edges'].append([arrs[0], arrs[1].split('\n')[0]])
	
		return G

def FormatOutput(graph):
	strline = ''

	for i in range(0, len(graph['nodes'])):
		strline += graph['nodes'][i]
		if i < len(graph['nodes']) - 1:
			strline += ','
	strline += '||'
	
	for i in range(0, len(graph['edges'])):
		strline += str(graph['edges'][i][0]) + ' ' + str(graph['edges'][i][1])
		if i < len(graph['edges']) - 1:
			strline += ','
	
	print strline

def WriteCurrentGraph(graph):
	f = open(newfp, 'w')
	f.write("%d\n"%len(graph['nodes']))
	for node in graph['nodes']:
		f.write("%s\n"%node)
	for edge in graph['edges']:
		f.write("%d %d\n"%(int(edge[0]), int(edge[1])))
	f.close()

if __name__ == '__main__':
	fp = 'data/' + sys.argv[1]
	newfp = 'data/' + sys.argv[2] + '.txt'
	graph = LoadGraph(fp)
	
	if not fp == newfp:
		WriteCurrentGraph(graph)
	
	FormatOutput(graph)
