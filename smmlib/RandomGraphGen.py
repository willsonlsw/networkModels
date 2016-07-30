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


def Gnp_Sparse_Random_Graph(n, p, seed=None):
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
    
    This is an O(n+m) algorithm where m is the expected number of edges m=n*(n-1)*p/2.
    It should be faster than RandomGraphGen when p is small.
    
    Reference:
    Batagelj and Brandes, "Efficient generation of large random networks", 
    Phys. Rev. E, 71, 036113, 2005.
    '''
    if not seed is None:
        random.seed(seed)
    G=[] # Initialize the graph with 0 edges
    v=1
    w=-1
    while v<n :
        r=random.random()
        w=w+1+int(math.log(1.0-r)/math.log(1.0-p))
        while w>=v and v<n :
            w=w-v
            v=v+1
        if v<n :
            G.append([v,w])
    return G


def Gnm_Random_Graph(n, m, seed=None):
    '''
    Return the random graph G{n,m}.
    
    Parameters
    ----------
    n : int
        The fixed number of nodes.
    m : int
        The fixed number of edges.
    seed : int, optional
        Seed for random number generator (default=None).
    '''
    if not seed is None:
        random.seed(seed)
    G=[] # Initialize the graph with 0 edges
    if n==1 :
        return G
    if m>n*(n-1)/2 :
        for u in xrange(n) :
            for v in xrange(u+1,n) :
                G.append([u,v])
        return G
    nodes_list=xrange(n)
    count=0
    while count<m :
        [u,v]=random.sample(nodes_list, 2)
        if [u,v] in G :
            continue
        else :
            G.append([u,v])
            count=count+1
    return G

# Gnm_Dense_Random_Graph(n, m, seed=None)

if __name__ == '__main__':
    G=Gnp_Random_Graph(5, 0.5)
    print G
    G=Gnp_Sparse_Random_Graph(5, 0.5)
    print G
    G=Gnm_Random_Graph(5, 6)
    print G
    