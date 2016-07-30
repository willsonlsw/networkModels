#this module include two function, calculating the AveragePathLength and Diameter
# interface: input_list is list of edge represented by start and end vertex,which could also be extended to weightened graph,node is number of node, is_directed values 1 for directed graph, and 0 for undirected
#return value is the AveragePathLength and Diameter

#Designed by JIA in 15th May,2015 

def Floyd(input_list, node, is_directed):
	if(node <= 0):
		print "node_num should be larger than 0\n"
		return [];
	graph_matrix = [[] for i in range(0,node)]
	for i in range(0,node):
		for j in range(0,node):
			graph_matrix[i].append(float("inf"))
	for i in range(0,node):
		graph_matrix[i][i] = 0

	for i in input_list:
		#i[3] for wreight
		if i[0] > node or i[1] > node or i[0] < 0 or i[1] < 0:
			print "Input_list should be corresponding to node_num. Out of range. \n"
			return [];
		graph_matrix[i[0] - 1][i[1] - 1] = 1
		if is_directed == 0:
			graph_matrix[i[1] - 1][i[0] - 1] = 1
	
	
	for i in range(0,node):
		for j in range(0,node):
			for k in range(0,node):
				tmp = graph_matrix[j][i] + graph_matrix[i][k];
				if tmp < graph_matrix[j][k]:
					graph_matrix[j][k] = tmp
	
#	print graph_matrix
	return graph_matrix





def AveragePathLength(input_list, node, is_directed):
	graph_matrix = Floyd(input_list, node, is_directed)
	if graph_matrix == []:
		return;
	total = 0
	valid_node = node
	invalid_list = []
	for i in range(0,node):
		if i in invalid_list:
			pass
		if is_directed == 0:
			count = 0
			for j in range(0,node):
				if graph_matrix[i][j] == float("inf"):
					count += 1
			if count == node - 1:
				invalid_list.append(i)
				valid_node -= 1
		else:
			count1 = 0
			count2 = 0
			for j in range(0,node):
				if graph_matrix[i][j] == float("inf"):
					count1 += 1
				if graph_matrix[j][i] == float("inf"):
					count2 += 1
			if count1 == node - 1 and count2 == node -1:
				invalid_list.append(i)
				valid_node -= 1

#	print invalid_list
	if is_directed == 0:
		for i in range(0,node):
			if i in invalid_list:
				pass
			else:
				for j in range(i+1,node):
					if j in invalid_list:
						pass
					else:
						tmp = graph_matrix[i][j]
						if tmp != float("inf"):
							total += tmp
		if valid_node > 1:
			apl = float(total)*2/(node*(node-1))
		else:
			apl = 0
	
	else:
		for i in range(0,node):
			if i in invalid_list:
				pass
			else:
				for j in range(0,node):
					if j in invalid_list:
						pass
					else:
						tmp = graph_matrix[i][j]
						if tmp == float("inf"):
							pass
						else:
							total += tmp
		if valid_node > 1:
			apl = float(total)/(node*(node-1))
		else:
			apl = 0
#	print apl
	return apl

def Diameter(input_list, node, is_directed):
	diameter = 0
	graph_matrix = Floyd(input_list, node, is_directed)
	if graph_matrix == []:
		return;
	if is_directed == 0:
		for i in range(0,node):
			for j in range(i+1,node):
				tmp = graph_matrix[i][j]
				if tmp > diameter and tmp != float("inf"):
					diameter = graph_matrix[i][j]
	else:
		for i in range(0,node):
			for j in range(0,node):
				tmp = graph_matrix[i][j]
				if tmp > diameter and tmp != float("inf"):
					diameter = tmp
#	print diameter
	return diameter
	
	

