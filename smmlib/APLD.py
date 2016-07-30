import numpy as np
def Floyd(nodes, edges, is_directed):
	node_dict = {}
	node_num = len(nodes)
	for i in range(0,node_num):
		node_dict[nodes[i]] = i
	
	graph_matrix = [[] for i in range(0,node_num)]
	for i in range(0,node_num):
		for j in range(0,node_num):
			graph_matrix[i].append(float("inf"))
	for i in range(0,node_num):
		graph_matrix[i][i] = 0
	for edge in edges:
		a0 = node_dict[edge[0]]
		a1 = node_dict[edge[1]]
		graph_matrix[a0][a1] = 1
		if is_directed == 0:
			graph_matrix[a1][a0] = 1
	
	for i in range(0,node_num):
		for j in range(0,node_num):
			for k in range(0,node_num):
				tmp = graph_matrix[j][i] + graph_matrix[i][k];
				if tmp < graph_matrix[j][k]:
					graph_matrix[j][k] = tmp
	
#	print graph_matrix
	return graph_matrix

def AveragePathLength(nodes, edges, is_directed):
	node_num = len(nodes)
	if node_num <= 1:
		return 0
	graph_matrix = Floyd(nodes, edges, is_directed)
	if graph_matrix == []:
		return 0;
	total = 0
	apl = 0
	if is_directed == 0:
		for i in range(0,node_num):
			for j in range(i+1,node_num):
				if graph_matrix[i][j] != float("inf"):
					total += graph_matrix[i][j]
		apl = float(total) * 2/(node_num * (node_num - 1)) 
	else:
		pathN = 0
		for i in range(0,node_num):
			for j in range(0,node_num):
				if graph_matrix[i][j] != float("inf"):
					total += graph_matrix[i][j]
					pathN += 1
		apl = float(total) / pathN
		#apl = float(total)/(node_num * node_num)
	
#	print apl
	return apl

'''
def AveragePathLength(nodes, edges, is_directed):
	node_num = len(nodes)
	graph_matrix = Floyd(nodes, edges, is_directed)
	if graph_matrix == []:
		return;
	total = 0
	valid_node = node_num
	invalid_list = []
	for i in range(0,node_num):
		if i in invalid_list:
			pass
		if is_directed == 0:
			count = 0
			for j in range(0,node_num):
				if graph_matrix[i][j] == float("inf"):
					count += 1
			if count == node_num - 1:
				invalid_list.append(i)
				valid_node -= 1
		else:
			count1 = 0
			count2 = 0
			for j in range(0,node_num):
				if graph_matrix[i][j] == float("inf"):
					count1 += 1
				if graph_matrix[j][i] == float("inf"):
					count2 += 1
			if count1 == node_num - 1 and count2 == node_num -1:
				invalid_list.append(i)
				valid_node -= 1

#	print invalid_list
	if is_directed == 0:
		for i in range(0,node_num):
			if i in invalid_list:
				pass
			else:
				for j in range(i+1,node_num):
					if j in invalid_list:
						pass
					else:
						tmp = graph_matrix[i][j]
						if tmp != float("inf"):
							total += tmp
		if valid_node > 1:
			apl = float(total)*2/(node_num*(node_num-1))
		else:
			apl = 0
	
	else:
		for i in range(0,node_num):
			if i in invalid_list:
				pass
			else:
				for j in range(0,node_num):
					if j in invalid_list:
						pass
					else:
						tmp = graph_matrix[i][j]
						if tmp == float("inf"):
							pass
						else:
							total += tmp
		if valid_node > 1:
			apl = float(total)/(node_num*(node_num-1))
		else:
			apl = 0
#	print apl
	return apl
'''

def Diameter(nodes, edges, is_directed):
	node_num = len(nodes)
	diameter = 0
	graph_matrix = Floyd(nodes, edges, is_directed)
	if graph_matrix == []:
		return;
	if is_directed == 0:
		for i in range(0,node_num):
			for j in range(i+1,node_num):
				tmp = graph_matrix[i][j]
				if tmp > diameter and tmp != float("inf"):
					diameter = graph_matrix[i][j]
	else:
		for i in range(0,node_num):
			for j in range(0,node_num):
				tmp = graph_matrix[i][j]
				if tmp > diameter and tmp != float("inf"):
					diameter = tmp
#	print diameter
	return diameter

if __name__ == '__main__':
	csvname = "output.txt"
	data = np.loadtxt(csvname,delimiter = ' ',dtype = 'str')
	data1 = data.astype('int')
	node = []
	edge = []
	for i in range(0,200):
		if data1[i][0] not in node:
			node.append(data1[i][0])
		if data1[i][1] not in node:
			node.append(data1[i][1])
		edge.append([data1[i][0],data1[i][1]])

	print Diameter(node, edge, 0)
