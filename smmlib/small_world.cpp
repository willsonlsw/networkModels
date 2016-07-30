#include <iostream>
#include <cstring>
#include <vector>
#include <cstdlib>
#include <unistd.h>
#include <cstdio>
using namespace std;

#define RAND_DBL() ((double)rand() / (double)RAND_MAX)
#define DG_NODE(dg, n, e) ((dg)->graph[((n) * (dg)->out_degree) + (e)])

typedef struct {
	// The number of nodes in the digraph
	size_t num_nodes;

	// The out-degree of the digraph
	size_t out_degree;

	// The Graph itself. This is an array of arrays of size (out_degree *
	// num_nodes). The array is formatted as graph[node][edge] and contains the
	// node number that the selected edge points to.
	size_t *graph;
} digraph_t;

void digraph_init(digraph_t *digraph, size_t num_nodes, size_t out_degree)
{
	digraph->num_nodes  = num_nodes;
	digraph->out_degree = out_degree;
	digraph->graph      = (size_t *)malloc(num_nodes * out_degree * sizeof(void*));
}

bool digraph_has_edge(digraph_t *digraph, size_t node, size_t target)
{
	size_t i;
	for (i = 0; i < digraph->out_degree; i++) {
		if (DG_NODE(digraph, node, i) == target)
			return true;
	}

	return false;
}

vector<vector<int> > small_world_init(digraph_t *digraph, size_t k, double b)
{
	// Create a ring network
	for (int i = 0; i < digraph->num_nodes; i++)
		for (int neighbour = 0; neighbour < k; neighbour++)
			DG_NODE(digraph, i, neighbour) = (i + neighbour + 1) % digraph->num_nodes;

	// Small-worldify it
	for (int neighbour = 0; neighbour < k; neighbour++) {
		for (int i = 0; i < digraph->num_nodes; i++) {
			if (RAND_DBL() < b) {
				size_t random_node;

				do {
					random_node = rand() % digraph->num_nodes;
				} while (random_node == i // Don't make a self loop
				         // Don't duplicate edges
				         || digraph_has_edge(digraph, i, random_node)
				         || digraph_has_edge(digraph, random_node, i));

				DG_NODE(digraph, i, neighbour) = random_node;
			}
		}
	}
	vector<vector<int> > graph;
	for (int i = 0; i < digraph->num_nodes; i++) {
        vector<int> tmp;
        for (int neighbour = 0; neighbour < k; neighbour++) {
            tmp.push_back(DG_NODE(digraph, i, neighbour));
		}
		graph.push_back(tmp);
	}
	return graph;
}

void rung(size_t n, size_t k, double b, char* graphId){
	digraph_t digraph;
	digraph_init(&digraph, n, k);
	vector<vector<int> > tmp = small_world_init(&digraph, k, b);
	free(digraph.graph);

	const char *pstr1 = "data/";
	const char *pstr2 = ".txt";
	char *fpath = new char[100];
	strcpy(fpath, pstr1);
	strcat(fpath, graphId);
	strcat(fpath, pstr2);

	FILE *fout = fopen(fpath,"w");
	fprintf(fout, "%d\n", n);
	for(int i = 0; i < n; i++)
		fprintf(fout, "%d\n", i);	
	for(int i = 0; i < tmp.size(); i++)
		for(int j = 0; j < tmp[i].size(); j++)
			fprintf(fout, "%d %d\n", i, tmp[i][j]);

	for(int i = 0; i < n; i++){
		cout << i;
		if(i != n - 1)
			cout << ',';
	}
	cout << "||";
	for(int i = 0; i < tmp.size(); i++){
		for(int j = 0; j < tmp[i].size(); j++){
			cout << i << ' ' << tmp[i][j];
			if(!(i == tmp.size() - 1 && j == tmp[i].size() - 1)){
				cout << ',';
			}
		}
	}
	cout<<endl;
	fclose(fout);
/*
	for (int i=0; i<tmp.size(); i++) {
        cout << i << ": ";
        for (int j=0; j<tmp[i].size(); j++) {
            cout << tmp[i][j] << " ";
        }
        cout << endl;
	}	
*/
}

size_t StrToInt(char *str){
	size_t tmp = 0;
	int i = 0;
	while(i < strlen(str))
		tmp = tmp * 10 + str[i++] - '0';
	return tmp;
}

double StrToDouble(char *str){
	double tmp = 0;
	int i = 0; 
	while(i < strlen(str) && str[i] != '.')
		tmp = tmp * 10 + str[i++] - '0';
	if(str[i] == '.') 
		i++;
	double x = 0.1f;
	while(i < strlen(str)){
		double y = str[i++] - '0';
		tmp += y * x;
		x *= 0.1f;
	}
	return tmp;
}

int main(int argc, char*argv[])
{
	size_t n = StrToInt(argv[1]);//20;   // Number of nodes
	size_t k = StrToInt(argv[2]);//3    // Distance of furthest neighbour
	double b = StrToDouble(argv[3]);//0.2;  // Small-world Randomisation

	rung(n, k, b, argv[4]);

    return 0;
}
