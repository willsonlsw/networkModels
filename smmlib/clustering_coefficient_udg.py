#coding=utf-8
import sys
#graph example: g={'nodes':[1,2,3,4,5,6],'edges':[[1,2],[2,3],[1,3],[3,4],[3,5]]}

fpath = 'data/' + sys.argv[1] + '.txt'

g={'nodes':[],'edges':[]}
'''
file=open('test1.txt','r')
lines=file.readlines()
'''
file = open(fpath, 'r')
nodeN = int(file.readline().split('\n')[0])
for i in range(0, nodeN):
    nod = file.readline().split('\n')[0]
    g['nodes'].append(nod)
lines = file.readlines()
for line in lines:
    arr = line.split('\n')[0].strip().split(' ')
    g['edges'].append([arr[0], arr[1]])

'''
for x in lines[0].strip().split(' '):
    g['nodes'].append(x)
for each_line in lines[1:]:
        [node1,node2]=each_line.strip().split(' ')
        g['edges'].append([node1,node2])
'''

def make_link(G, node1, node2):
	if node1 not in G:
		G[node1] = {}
	(G[node1])[node2] = 1
	if node2 not in G:
		G[node2] = {}
	(G[node2])[node1] = 1
	return G
	
G = {}
for (x,y) in g['edges']: make_link(G,x,y)

def clustering_coefficient(G,v):
	neighbors = G[v].keys()
	if len(neighbors) == 1:
		return 0.0
	links = 0
	for w in neighbors:
		for u in neighbors:
			if u in G[w]: links += 0.5
	lcc=2.0*links/(len(neighbors)*(len(neighbors)-1))
	return lcc

def local_clustering_coefficient(g,v):
	if v not in G.keys():
		return 0.0
	localcc= clustering_coefficient(G,v)
	return localcc
	
local_cc={}

for u in g['nodes']:
    local_cc[u]=round(local_clustering_coefficient(g,u),3)

total=0.0
for v in G.keys():
    total += clustering_coefficient(G,v)

average_cc=round(total/len(g['nodes']),3)

def generate_triangles(G):
    """Generate triangles"""
    for node_a in G.keys():
        for node_b in G[node_a].keys():
            if node_b == node_a:
                raise ValueError # nodes shouldn't point to themselves
            for node_c in G[node_b].keys():
                if node_a in G[node_c].keys():
                    yield(node_a, node_b, node_c)
        

def generate_triplets(G):
    """Generate triplets"""
    for node_a in G.keys():
        for node_b in G[node_a].keys():
            if node_b == node_a:
                raise ValueError # nodes shouldn't point to themselves
           
            for node_c in G[node_a].keys():
                if node_c==node_a or node_c==node_b:
                    continue
                yield(node_a, node_b, node_c)
        

triplets = list(generate_triplets(G))		
cycles = list(generate_triangles(G))
triangle=len(cycles)/2.0

global_cc=triangle/(len(triplets)/2.0)

format_str = ''
for node in local_cc:
	format_str += str(node) + ':' + str(local_cc[node]) + '||'
format_str += '|'
format_str += str(average_cc) + ':' + str(round(global_cc, 3))
#print local_cc
#print "average_clustering_coefficient: "+str(average_cc)
#print "global_clustering_coefficient: "+str(round(global_cc,3))

print format_str
