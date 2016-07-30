import sys
import math

def Fitline(points):
	learning_rate = 0.001
	theta = [-1, 0]
	for i in range(0, 10000):
		for j in range(0, len(points)):
			caly = theta[0] * points[j][0] + theta[1]
			theta[0] -= learning_rate * (caly - points[j][1]) * points[j][0]
			theta[1] -= learning_rate * (caly - points[j][1]);
	return theta

def LeastSquare(points):
	t1 = 0.0
	t2 = 0.0
	t3 = 0.0
	t4 = 0.0
	for point in points:
		t1 += point[0] * point[0]
		t2 += point[0]
		t3 += point[0] * point[1]
		t4 += point[1]
	
	n = len(points)
	a = (t3 * n - t2 * t4) / (n * t1 - t2 * t2)
	b = (t1 * t4 - t2 * t3) / (n * t1 - t2 * t2)
	return [a, b]

def AverageError(points, theta):
	error = 0.0
	for point in points:
		py = theta[0] * point[0] + theta[1]
		error += (py - point[1]) * (py - point[1])
	return error / float(len(points))

def GetError(point, theta):
	py = theta[0] * point[0] + theta[1]
	return (py - point[1]) * (py - point[1])

def FormatOutput(degreedis, theta, nodeN, maxper, maxdper):
	line = ''
	degreelist = []
	for degree in degreedis:
		degreelist.append([degree, degreedis[degree]])

	degreelist.sort()

	for item in degreelist:
		if item[0] == 0:
			continue;
		line += str(item[0]) + ':' + str(float(item[1]) / nodeN) + '||'
	line += '|'
	'''
	maxx = (maxy - theta[1])/ theta[0]
	minx = (miny - theta[1])/ theta[0]
	line += str(maxx) + ':' + str(maxy) + '||' + str(minx) + ':' + str(miny)
	'''
	#a = theta[0]
	#b = theta[1]
	a = math.e ** theta[1]
	b = 0 - theta[0]
	
	line += str(a) + ',' + str(b) + ',' + str(maxper) + ',' + str(maxdper)

	print line

if __name__ == '__main__':
	#print "0:0.07||1:0.14||2:0.18||3:0.28||4:0.14||5:0.07||6:0.08||7:0.03||8:0.01|||0.838732225357:-1.27296567581||2.52551228799:-4.60517018599"
	#f = open('data/')
	fpath = 'data/' + sys.argv[1] + '.txt'
	f = open(fpath, 'r')
	nodes = {}
	nodeN = int(f.readline().split('\n')[0])
	'''
	for i in range(0, nodeN):
		node = f.readline().split('\n')[0]
		if not node in nodes:
			nodes[node] = {}
			nodes[node]['in'] = 0
			nodes[node]['out'] = 0
	lines = f.readlines()
	for line in lines:
		arr = line.split('\n')[0].split(' ')
		nodes[arr[0]]['out'] += 1
		nodes[arr[1]]['in'] += 1
	
	print len(nodes)
	ind = 0
	outd = 0
	for node in nodes:
		print nodes[node]
		ind += nodes[node]['in']
		outd += nodes[node]['out']
	print ind, outd
	'''
	for i in range(0, nodeN):
		node = f.readline().split('\n')[0]
		nodes[node] = 0
	lines = f.readlines()
	#print lines
	for line in lines:
		arr = line.split('\n')[0].split(' ')
		#print line,arr
		nodes[arr[0]] += 1
		nodes[arr[1]] += 1
	
	degreedis = {}
	for node in nodes:
		if not nodes[node] in degreedis:
			degreedis[nodes[node]] = 1
		else:
			degreedis[nodes[node]] += 1
	'''
	for degree in degreedis:
		print degree, ':', float(degreedis[degree]) / nodeN
	'''

	points = []
	maxdegree = 0
	maxper = 0.0
	#miny = 0.0
	#maxy = -1000.0
	for degree in degreedis:
		if degree == 0 or degree == 1:
			continue
		per = float(degreedis[degree]) / nodeN
		point = [math.log(degree), math.log(per)]
		if per > maxper:
			maxper = per
		if degree > maxdegree:
			maxdegree = degree
		#if point[1] > maxy:
		#	maxy = point[1]
		#if point[1] < miny:
		#	miny = point[1]
		points.append(point)

	outlierN = int(len(points) * 0.3) + 1
	for i in range(0, outlierN):
		theta = LeastSquare(points)	
		aerror = AverageError(points, theta)
		flag = 0
		maxerror = 0.0
		maxej = 0
		for j in range(0, len(points)):
			if GetError(points[j], theta) > maxerror:
				maxerror = GetError(points[j], theta)
				maxej = j

		if maxerror > 2 * aerror:
			del points[maxej]
			flag = 1

		if flag == 0:
			break
	
	#print theta
	
	FormatOutput(degreedis, theta, nodeN, maxper, float(maxdegree) / nodeN)
