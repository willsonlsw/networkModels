import sys

def WriteToGraphFile(graphId, gstr):
	fpath = 'data/' + graphId + '.txt'
	f = open(fpath, 'w')
	G = {'nodes':[], 'edges':[]}
	arrs = gstr.split('_')
	G['nodes'] = arrs[0].split(',')
	edges = arrs[1].split(',')
	for edge in edges:
		G['edges'].append([edge.split(':')[0], edge.split(':')[1]])

	f.write('%d\n'%len(G['nodes']))
	for node in G['nodes']:
		f.write('%s\n'%node)
	for edge in G['edges']:
		f.write('%s %s\n'%(edge[0], edge[1]))
	f.close()
		

def WriteLog(lines):
	f = open('log/savg.txt','w')
	for line in lines:
		f.write("%s\n"%line)

if __name__=='__main__':
	WriteLog(sys.argv)
	WriteToGraphFile(sys.argv[1], sys.argv[2])
	print 'save graph OK!'
